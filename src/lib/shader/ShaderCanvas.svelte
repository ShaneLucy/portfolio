<script lang="ts">
  import { onMount } from 'svelte';
  import { motionStore } from '$lib/stores/motion.svelte';
  import { shaderStore, type SectionId } from '$lib/stores/shader.svelte';

  type ShaderState = { palette_t: number; flow_speed: number; density: number };

  const SECTION_STATES: Record<SectionId, ShaderState> = {
    hero:     { palette_t: 0.5,  flow_speed: 0.4,  density: 0.6  },
    projects: { palette_t: 0.75, flow_speed: 0.25, density: 0.4  },
    about:    { palette_t: 0.25, flow_speed: 0.35, density: 0.5  },
    contact:  { palette_t: 0.6,  flow_speed: 0.5,  density: 0.65 },
  };

  const TRANSITION_DURATION = 1.2; // seconds, cubic ease-out

  let canvas = $state<HTMLCanvasElement>();
  let gl: WebGLRenderingContext | null = null;
  let rafId: number | null = null;
  let timeAccum = 0;
  let lastTs: number | null = null;

  // Interpolated shader state — plain variables, mutated every rAF frame.
  let curr: ShaderState = { ...SECTION_STATES.hero };
  let from: ShaderState = { ...SECTION_STATES.hero };
  let transitionStart = 0;

  let uTime: WebGLUniformLocation | null = null;
  let uResolution: WebGLUniformLocation | null = null;
  let uPaletteT: WebGLUniformLocation | null = null;
  let uFlowSpeed: WebGLUniformLocation | null = null;
  let uDensity: WebGLUniformLocation | null = null;

  let pixelRatio = 1;

  const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  // Domain-warped simplex noise fluid field.
  // Palette colours are pre-converted from OKLCH to linear sRGB.
  // Output is gamma-encoded for correct display.
  const FRAG = `
precision mediump float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_palette_t;
uniform float u_flow_speed;
uniform float u_density;

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

// Branch-free 4-stop gradient
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

  // Cool palette — linear sRGB from OKLCH(L% C H):
  // deep(22% 0.12 265), mid(48% 0.18 295), bright(72% 0.16 195), accent(85% 0.12 185)
  vec3 coolDeep   = vec3(0.001, 0.005, 0.082);
  vec3 coolMid    = vec3(0.139, 0.048, 0.467);
  vec3 coolBright = vec3(0.000, 0.539, 0.549);
  vec3 coolAccent = vec3(0.116, 0.801, 0.687);

  // Warm palette — linear sRGB from OKLCH(L% C H):
  // deep(22% 0.12 35), mid(55% 0.20 50), bright(78% 0.18 70), accent(88% 0.14 80)
  vec3 warmDeep   = vec3(0.056, 0.000, 0.000);
  vec3 warmMid    = vec3(0.566, 0.044, 0.000);
  vec3 warmBright = vec3(0.996, 0.346, 0.000);
  vec3 warmAccent = vec3(1.000, 0.607, 0.122);

  // Near-black background matching --surface-base oklch(6% 0.012 270)
  vec3 bg = vec3(0.001, 0.002, 0.007);

  vec3 coolColor  = gradient4(lum, coolDeep, coolMid, coolBright, coolAccent);
  vec3 warmColor  = gradient4(lum, warmDeep, warmMid, warmBright, warmAccent);
  vec3 fluidColor = mix(coolColor, warmColor, u_palette_t);

  vec3 color = mix(bg, fluidColor, lum);
  gl_FragColor = vec4(linearToSRGB(color), 1.0);
}`;

  function compileShader(type: number, source: string): WebGLShader | null {
    if (!gl) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[ShaderCanvas] compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initGL(): boolean {
    if (!canvas) return false;
    const ctx = canvas.getContext('webgl');
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
      console.error('[ShaderCanvas] link error:', gl.getProgramInfoLog(program));
      return false;
    }

    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uTime       = gl.getUniformLocation(program, 'u_time');
    uResolution = gl.getUniformLocation(program, 'u_resolution');
    uPaletteT   = gl.getUniformLocation(program, 'u_palette_t');
    uFlowSpeed  = gl.getUniformLocation(program, 'u_flow_speed');
    uDensity    = gl.getUniformLocation(program, 'u_density');

    handleResize();
    return true;
  }

  function handleResize() {
    if (!gl || !canvas) return;
    const w = Math.floor(window.innerWidth  * pixelRatio);
    const h = Math.floor(window.innerHeight * pixelRatio);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function renderFrame(time: number) {
    if (!gl || !canvas) return;
    gl.uniform1f(uTime, time);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uPaletteT, curr.palette_t);
    gl.uniform1f(uFlowSpeed, curr.flow_speed);
    gl.uniform1f(uDensity, curr.density);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function loop(ts: number) {
    if (lastTs !== null) timeAccum += (ts - lastTs) / 1000;
    lastTs = ts;

    // Advance interpolation toward active section target (cubic ease-out)
    const target = SECTION_STATES[shaderStore.activeSection];
    const elapsed = timeAccum - transitionStart;
    const t = Math.min(elapsed / TRANSITION_DURATION, 1.0);
    const eased = 1 - Math.pow(1 - t, 3);

    curr.palette_t  = from.palette_t  + (target.palette_t  - from.palette_t)  * eased;
    curr.flow_speed = from.flow_speed + (target.flow_speed - from.flow_speed) * eased;
    curr.density    = from.density    + (target.density    - from.density)    * eased;

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
    pixelRatio = window.matchMedia('(max-width: 768px)').matches
      ? 0.5
      : Math.min(window.devicePixelRatio, 1.5);

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
      renderFrame(0);
    }

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
    };
  });

  // React to active section changes: begin interpolation (or snap when motion is off).
  $effect(() => {
    const section = shaderStore.activeSection;
    if (!gl) return;
    if (motionStore.enabled) {
      from = { ...curr };
      transitionStart = timeAccum;
    } else {
      curr = { ...SECTION_STATES[section] };
      from = { ...curr };
      renderFrame(timeAccum);
    }
  });

  // React to motion toggle: start/stop loop.
  $effect(() => {
    if (!gl) return;
    if (motionStore.enabled) {
      startLoop();
    } else {
      stopLoop();
      renderFrame(timeAccum);
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
