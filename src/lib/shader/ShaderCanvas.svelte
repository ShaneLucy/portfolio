<script lang="ts">
  import { onMount } from "svelte";
  import { motionStore } from "$lib/stores/motion.svelte";
  import { shaderStore, type SectionId } from "$lib/stores/shader.svelte";

  const BASE_FLOW_SPEED = 0.35;
  const BASE_DENSITY = 0.55;
  const BASE_DISTURBANCE = 0.6;

  const SECTION_PALETTE: Record<SectionId, number> = {
    hero: 0.5,
    projects: 0.75,
    about: 0.25,
    contact: 0.6
  };

  const TRANSITION_DURATION = 1.2;
  const TRACE_SIZE = 32;
  const TRACE_DISSOLVE = 4.0;
  const STATIC_TIME = 12.5; // fixed time for prefers-reduced-motion frame
  const MIN_TRACE_DIST_SQ = 0.008 * 0.008;

  let canvas = $state<HTMLCanvasElement>();
  let gl: WebGLRenderingContext | null = null;
  let rafId: number | null = null;
  let timeAccum = 0;
  let lastTs: number | null = null;

  let currPalette = SECTION_PALETTE.hero;
  let fromPalette = SECTION_PALETTE.hero;
  let transitionStart = 0;

  // Trace ring buffer — positions in UV space (0–1), ages in [0,1]
  const tracePos = new Float32Array(TRACE_SIZE * 2).fill(-1);
  const traceAge = new Float32Array(TRACE_SIZE).fill(1.0);
  let traceHead = 0;
  let pointerDown = false;
  let lastTX = -1,
    lastTY = -1;
  let ptrX = 0.5,
    ptrY = 0.5;

  // Uniform locations
  let uTime: WebGLUniformLocation | null = null;
  let uResolution: WebGLUniformLocation | null = null;
  let uPaletteT: WebGLUniformLocation | null = null;
  let uFlowSpeed: WebGLUniformLocation | null = null;
  let uDensity: WebGLUniformLocation | null = null;
  let uDisturbance: WebGLUniformLocation | null = null;
  let uPointer: WebGLUniformLocation | null = null;
  let uPointerActive: WebGLUniformLocation | null = null;
  let uTrace: WebGLUniformLocation | null = null;
  let uTraceAge: WebGLUniformLocation | null = null;

  let pixelRatio = 1;

  const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  const FRAG = `
precision mediump float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_palette_t;
uniform float u_flow_speed;
uniform float u_density;
uniform float u_disturbance;
uniform vec2  u_pointer;
uniform float u_pointer_active;
uniform vec2  u_trace[32];
uniform float u_trace_age[32];

vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289v3(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 gradient4(float t, vec3 c0, vec3 c1, vec3 c2, vec3 c3) {
  float s = clamp(t, 0.0, 1.0) * 3.0;
  vec3 g01 = mix(c0, c1, clamp(s,       0.0, 1.0));
  vec3 g12 = mix(c1, c2, clamp(s - 1.0, 0.0, 1.0));
  vec3 g23 = mix(c2, c3, clamp(s - 2.0, 0.0, 1.0));
  return mix(mix(g01, g12, step(1.0, s)), g23, step(2.0, s));
}

vec3 linearToSRGB(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * u_flow_speed;
  vec2 p  = uv * 1.6;

  // Domain warp: two noise samples offset the sampling position
  float w1 = snoise(p + vec2(t * 0.28,  t * 0.19));
  float w2 = snoise(p + vec2(t * 0.17, -t * 0.24) + 3.3);
  vec2 warped = p + vec2(w1, w2) * 0.35;

  // Two octaves on the warped field
  float n1 = snoise(warped * 1.3 + t * 0.12);
  float n2 = snoise(warped * 2.7 - t * 0.09 + 5.1);
  float fluid = n1 * 0.65 + n2 * 0.35;

  float raw = fluid * 0.5 + 0.5;
  float threshold = 1.0 - u_density;
  float lum = smoothstep(threshold - 0.15, threshold + 0.45, raw);

  // Cool palette — linear sRGB approximations from OKLCH design tokens
  vec3 coolDeep   = vec3(0.001, 0.005, 0.082);
  vec3 coolMid    = vec3(0.139, 0.048, 0.467);
  vec3 coolBright = vec3(0.000, 0.539, 0.549);
  vec3 coolAccent = vec3(0.116, 0.801, 0.687);

  // Warm palette
  vec3 warmDeep   = vec3(0.056, 0.000, 0.000);
  vec3 warmMid    = vec3(0.566, 0.044, 0.000);
  vec3 warmBright = vec3(0.996, 0.346, 0.000);
  vec3 warmAccent = vec3(1.000, 0.607, 0.122);

  vec3 bg = vec3(0.001, 0.002, 0.007);

  vec3 coolColor  = gradient4(lum, coolDeep, coolMid, coolBright, coolAccent);
  vec3 warmColor  = gradient4(lum, warmDeep, warmMid, warmBright, warmAccent);
  vec3 fluidColor = mix(coolColor, warmColor, u_palette_t);
  vec3 color = mix(bg, fluidColor, lum);

  // Trace mark-making: Gaussian splat per ring-buffer point, fading with age.
  // Aspect-corrected distance so splats appear circular on non-square viewports.
  float aspect = u_resolution.x / u_resolution.y;
  float radius = u_disturbance * 0.09;
  float traceContrib = 0.0;
  for (int i = 0; i < 32; i++) {
    float age = u_trace_age[i];
    if (age >= 1.0) continue;
    vec2 d = vec2((uv.x - u_trace[i].x) * aspect, uv.y - u_trace[i].y);
    float fade = 1.0 - smoothstep(0.6, 1.0, age);
    traceContrib += exp(-dot(d, d) / (radius * radius)) * fade;
  }
  traceContrib = clamp(traceContrib, 0.0, 1.0);

  vec3 traceAccent = mix(coolAccent, warmAccent, u_palette_t);
  color = mix(color, traceAccent, traceContrib * 0.85);

  gl_FragColor = vec4(linearToSRGB(color), 1.0);
}`;

  function compileShader(type: number, source: string): WebGLShader | null {
    if (!gl) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("[ShaderCanvas] compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initGL(): boolean {
    if (!canvas) return false;
    const ctx = canvas.getContext("webgl");
    if (!ctx) return false;
    gl = ctx;

    const vert = compileShader(gl.VERTEX_SHADER, VERT);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return false;

    const program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[ShaderCanvas] link error:", gl.getProgramInfoLog(program));
      return false;
    }

    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uTime = gl.getUniformLocation(program, "u_time");
    uResolution = gl.getUniformLocation(program, "u_resolution");
    uPaletteT = gl.getUniformLocation(program, "u_palette_t");
    uFlowSpeed = gl.getUniformLocation(program, "u_flow_speed");
    uDensity = gl.getUniformLocation(program, "u_density");
    uDisturbance = gl.getUniformLocation(program, "u_disturbance");
    uPointer = gl.getUniformLocation(program, "u_pointer");
    uPointerActive = gl.getUniformLocation(program, "u_pointer_active");
    uTrace = gl.getUniformLocation(program, "u_trace");
    uTraceAge = gl.getUniformLocation(program, "u_trace_age");

    handleResize();
    return true;
  }

  function handleResize() {
    if (!gl || !canvas) return;
    const w = Math.floor(window.innerWidth * pixelRatio);
    const h = Math.floor(window.innerHeight * pixelRatio);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function renderFrame(time: number) {
    if (!gl || !canvas) return;
    gl.uniform1f(uTime, time);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uPaletteT, currPalette);
    gl.uniform1f(uFlowSpeed, BASE_FLOW_SPEED);
    gl.uniform1f(uDensity, BASE_DENSITY);
    gl.uniform1f(uDisturbance, BASE_DISTURBANCE);
    gl.uniform2f(uPointer, ptrX, ptrY);
    gl.uniform1f(uPointerActive, pointerDown ? 1.0 : 0.0);
    gl.uniform2fv(uTrace, tracePos);
    gl.uniform1fv(uTraceAge, traceAge);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function currentFrameTime(): number {
    return timeAccum > 0 ? timeAccum : STATIC_TIME;
  }

  function addTracePoint(x: number, y: number) {
    const dx = x - lastTX;
    const dy = y - lastTY;
    if (lastTX >= 0 && dx * dx + dy * dy < MIN_TRACE_DIST_SQ) return;
    const idx = traceHead % TRACE_SIZE;
    tracePos[idx * 2] = x;
    tracePos[idx * 2 + 1] = y;
    traceAge[idx] = 0.0;
    traceHead++;
    lastTX = x;
    lastTY = y;
  }

  function loop(ts: number) {
    const dt = lastTs !== null ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
    if (lastTs !== null) timeAccum += dt;
    lastTs = ts;

    // Age all active trace points
    for (let i = 0; i < TRACE_SIZE; i++) {
      if (traceAge[i] < 1.0) {
        traceAge[i] = Math.min(1.0, traceAge[i] + dt / TRACE_DISSOLVE);
      }
    }

    const targetPalette = SECTION_PALETTE[shaderStore.activeSection];
    const elapsed = timeAccum - transitionStart;
    const t = Math.min(elapsed / TRANSITION_DURATION, 1.0);
    const eased = 1 - Math.pow(1 - t, 3);
    currPalette = fromPalette + (targetPalette - fromPalette) * eased;

    renderFrame(timeAccum);
    rafId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (rafId !== null || !gl) return;
    lastTs = null;
    rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    lastTs = null;
  }

  onMount(() => {
    pixelRatio = window.matchMedia("(max-width: 768px)").matches ? 0.5 : Math.min(window.devicePixelRatio, 1.5);

    if (!initGL()) return;

    const ro = new ResizeObserver(handleResize);
    ro.observe(document.documentElement);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) stopLoop();
        else if (motionStore.enabled) startLoop();
      },
      { threshold: 0 }
    );
    io.observe(canvas!);

    if (motionStore.enabled) {
      startLoop();
    } else {
      // Render at a fixed non-zero time so the static frame shows developed fluid patterns
      renderFrame(STATIC_TIME);
    }

    // Pointer tracking — listeners on document since canvas is pointer-events: none
    function onPointerDown(e: PointerEvent) {
      pointerDown = true;
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      ptrX = x;
      ptrY = y;
      addTracePoint(x, y);
    }

    function onPointerMove(e: PointerEvent) {
      ptrX = e.clientX / window.innerWidth;
      ptrY = 1 - e.clientY / window.innerHeight;
      if (pointerDown) addTracePoint(ptrX, ptrY);
    }

    function onPointerUp() {
      pointerDown = false;
      lastTX = -1;
      lastTY = -1;
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };
  });

  // React to active section changes: begin interpolation (or snap when motion is off).
  $effect(() => {
    const section = shaderStore.activeSection;
    if (!gl) return;
    if (motionStore.enabled) {
      fromPalette = currPalette;
      transitionStart = timeAccum;
    } else {
      currPalette = SECTION_PALETTE[section];
      fromPalette = currPalette;
      renderFrame(currentFrameTime());
    }
  });

  // React to motion toggle: start/stop loop.
  $effect(() => {
    if (!gl) return;
    if (motionStore.enabled) {
      startLoop();
    } else {
      stopLoop();
      renderFrame(currentFrameTime());
    }
  });
</script>

<canvas bind:this={canvas} aria-hidden="true" class="shader-canvas"></canvas>

<style>
  .shader-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>
