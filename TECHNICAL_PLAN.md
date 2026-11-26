# Technical Plan: Pop-up Book

_Written 2026-11-26 from the tech-lead review. `CREATIVE_DIRECTION.md` is the source of truth for what's being built. This doc covers how._

---

## Status

**Decided (2026-11-26):**

- **D1:** three.js directly, pinned to exactly `0.187.0`.
- **D8:** the cover is raised relief.
- **Spike:** it's built on `main` in the working tree. It's never committed, and it's discarded afterwards.

**Open:** D2–D7 and D9–D12. They get settled at the spike gate; D3 and D10 depend on what the spike measures. They're listed under [Open Decisions](#open-decisions).

---

## Facts That Shaped the Plan (checked 2026-11-26)

- **Both deploy workflows target the blog.** `.github/workflows/deploy.yml` and `../solar-system/.github/workflows/deploy.yml` both deploy with `--project-name=blog`, the blog's Cloudflare Pages project. Neither runs today: their `on:` blocks are commented out, which GitHub treats as invalid. Fix this before either is switched back on.
- **SvelteKit 3 is `latest` (3.4.1).** The 2.x line continues as 2.70.4, and `@sveltejs/adapter-static` 4.x requires Kit 3.
- **three.js is at r187 (`0.187.0`).** r186 removed `PCFSoftShadowMap`, and plain `PCFShadowMap` has been soft since r182. r187 stopped `setViewport` and `setScissor` scaling by pixel ratio. solar-system's `RendererSizer` sets the pixel ratio to 1, so it should be unaffected; verify that when porting it.
- **Bundle size.** solar-system's 3D route chunk (r185, the GLTF, Draco and KTX2 loader wrappers, and scene code) is about 722 kB raw, about 190 kB gzip. The book's chunk will be smaller, but three dominates it, so the 150 kB-per-route budget needs a decision (D10).

---

## 1. Rendering Stack

- **three.js directly,** with `WebGLRenderer`, pinned to exactly `0.187.0`.
  - Recent minor releases removed or changed APIs, and PCSS patches internal shader chunks, so every upgrade is a deliberate one.
  - WebGL 1 support was dropped in r163, so "no WebGL" really means "no WebGL 2".
- **Reuse solar-system's structure:**
  - a composition root, `BookSceneFactory`;
  - a `BookController` that owns the renderer and `setAnimationLoop`;
  - `RendererSizer`;
  - no Svelte anywhere under `src/lib/book/**`. Only `BookStage.svelte` touches Svelte.
- **Keep SSR on.** solar-system's root `ssr = false` suits a canvas-only app. Here it would prerender an empty shell and lose LCP and SEO.
  - Set `prerender = true` in the root `+layout.ts`.
  - `BookStage` prerenders the cover still plus an empty canvas.
  - The 3D module loads with `import()` inside an `$effect`, after first paint and idle time, and only when motion is on and WebGL 2 is available.
- **Keep three out of the initial chunk.** An ESLint `no-restricted-imports` rule allows `three` only under `src/lib/book/scene/**`. A CI size check reads the Vite manifest, following the same pattern as solar-system's `check-bench.ts`.
- **Adapter: `adapter-static`.** The site needs no server. Which version depends on D2.

## 2. Scene Architecture

```
src/lib/book/
  mechanics/   pure TS, no three: folds, V-fold, leaves, scroll map, springs, lamp, quality
  geometry/    path parser, extrusion, UVs
  spreads/     one folder per spread: definition.ts (mechanism tree + outlines), accent
  scene/       three: factory, controller, paper material, lamp, sizer
  registry.ts  ordered spread list, the single source for DOM sections, nav, leaves and stills
src/lib/book/BookStage.svelte
```

- **The book.** Two boards plus leaves. Spread _k_ is the back of leaf _k_ plus the front of leaf _k+1_.
  - Leaves are rigid and rotate about the spine. Pop-up pages are board, so rigid is honest.
  - Each leaf is offset by its index in the stack so leaves never z-fight.
- **`open` comes from the leaves.** The fold angle of spread _k_ is φₖ = θₖ − θₖ₊₁, and openₖ = φₖ / π.
  - One turning leaf closes one spread and opens the next, which is exactly the brief.
  - It stays correct when two leaves are mid-turn after a nav jump.
- **The spread contract** is `build(ctx) → { root, setOpen(open), dispose() }`.
  - Inside, a mechanism tree is solved into a `Float32Array` of per-piece matrices.
  - Meshes use `matrixAutoUpdate = false` and copy their matrix from it, so nothing is allocated per frame.
  - The hinge hierarchy lives in the maths, and the scene graph stays flat.
- **Visibility.** Only spreads with open > 0 are drawn, which is two at most. The rest lie folded flat inside the stack, hidden. Spread _k+1_'s geometry is built while spread _k_ is active.
- **Scroll to leaves.**
  - Section offsets are cached with a `ResizeObserver` and re-measured after `document.fonts.ready`. Each frame reads only `scrollY`.
  - Leaf _i_ turns over a window centred on the moment the boundary between sections _i_ and _i+1_ crosses the reading line: θᵢ = π · ease(t).
  - The reading line is a named constant shared with `SectionTracker` (rootMargin −40%/−40%). So the turn midpoint, the active-section switch and the aria-live announcement all happen together.
  - Sections get a min-height so turn windows can't overlap, and a test asserts it.
- **Smoothing.** The rendered leaf angle follows its scroll target through a critically damped spring with a maximum angular speed. Mouse-wheel steps come out smooth, and anchor jumps riffle through the pages instead of teleporting.
- **Stores.** `shaderStore` becomes `sectionStore`, since it only holds the active section now. `SectionId` derives from the registry. `motionStore` stays.
- **Bug to fix along the way.** `motionStore.init()` runs in `MotionToggle`'s `onMount`. If `BookStage`'s effect runs first, it sees the default "motion on" and starts downloading three for a reduced-motion user.
  - Make the store initialise itself on its first browser read.
  - Add a tiny inline head script that sets `data-motion` on `<html>` from the same localStorage key, so CSS picks the right mode before first paint.
- **The stage state machine is a pure function.** Its states are `still | loading | live | failed`. Its inputs are: the motion setting, WebGL 2 availability, chunk loaded, first frame presented, context lost, and quality floor breached. It's unit-testable, and it's what guarantees reduced-motion users never download three.

## 3. Pop-up Mechanics

Everything is rigid card on hinges. Every closed loop must be a linkage with one degree of freedom, so every solve is closed-form, with no iteration.

- **Parallel folds** (creases parallel to the gutter) are planar four-bars in the cross-section perpendicular to the gutter.
  - For a given φ, the glue points P (left page) and Q (right page) are known. The free corner is where circle(P, L₁) meets circle(Q, L₂); take the upper root.
  - Watch out for the parallelogram case. It stands at 90° but lies flat at 180°, so it won't stand up in a book that opens flat.
  - Tents, standing flats and the travel layers are general four-bars. Their flat-fold condition (d₁ + L₁ = d₂ + L₂ for an outward fold) is checked in tests.
- **V-folds** are spherical four-bars. The gutter, both glue lines and the centre crease must meet at one point, or the mechanism jams.
  - The types make the wrong case impossible to express: a V-fold is defined by an apex on the gutter, two glue angles (on the pages) and two crease angles (on the card).
  - From φ you get the glue-line directions u_L and u_R. The crease direction c then satisfies c·u_L = cos β_L and c·u_R = cos β_R:

```ts
const DEGENERATE_EPSILON = 1e-9;

/** Writes the crease direction into `out`; returns false when no rigid pose exists. */
export function solveCrease(uL: Vec3, uR: Vec3, cosBetaL: number, cosBetaR: number, out: Vec3): boolean {
  const k = dot(uL, uR);
  const sinSquared = 1 - k * k;
  if (sinSquared < DEGENERATE_EPSILON) {
    return false; // glue lines aligned (book closed): caller uses the folded-flat pose
  }
  const a = (cosBetaL - k * cosBetaR) / sinSquared;
  const b = (cosBetaR - k * cosBetaL) / sinSquared;
  const gSquared = (1 - a * a - b * b - 2 * a * b * k) / sinSquared;
  if (gSquared < 0) {
    return false; // card would have to stretch: a design error the validation suite catches
  }
  combine(uL, uR, a, b, Math.sqrt(gSquared), out); // a·uL + b·uR + g·(uL × uR); g ≥ 0 is the open side
  return true;
}
```

Each wing's frame is then (u, c, u × c).

- **The hinge hierarchy is a mechanism tree.** Each node takes two parent planes that share a hinge line (at the root: the two pages and the gutter). It outputs its pieces' frames and plane pairs for its children. A V-fold on a V-fold, or a step on a tent, is the same solver one level down.
- **Tunnel layers.** Each trip is a standing-flat four-bar at its own depth, ordered back to front. A new trip is one more layer entry. Tests catch a layer that collides or stops the book closing.
- **Clipping.** Each mechanism is clip-free by construction. On top of that, each spread has a validation suite that samples φ from 0 to π in 1° steps and checks:
  - a rigid pose exists at every step;
  - the spread closes completely flat at φ = 0, inside the page;
  - nothing ever sticks out past the page edges;
  - non-adjacent pieces never intersect (triangle tests with bounding-box culling).
- **Card thickness.** Valley folds hinge on the inner surface and mountain folds on the outer one. Glue tabs are offset by the card thickness.
- **Pure and unit-tested:** all of the above, plus the leaf-to-open mapping, scroll map, springs, lamp mapping and drift, quality governor and the stage state machine.

## 4. Geometry Pipeline

- **Data** is in millimetres at real book scale (a page is about 200 × 260 mm). Each piece has an outline as an SVG `d` string (piece-local), holes, a stock (white or accent), a parent node and attach parameters. The authoring format is D7.
- **Path to card.**
  - A small pure parser turns `d` into polygons: M, L, H, V, C, Q and Z, absolute and relative.
  - Curves are flattened adaptively to a named tolerance, and winding is normalised.
  - The result becomes a `Shape`, then an `ExtrudeGeometry` at card thickness with a tiny bevel.
  - Extrusion groups give caps and sides separate materials (face vs cut edge).
  - UVs are in mm, so fibre scale is identical on every piece.
- **When to build.** Each spread is built lazily, and the cost is measured. If triangulation causes tasks over 50 ms, split them with `scheduler.yield()` or move them to a worker; the arrays transfer cleanly. Pieces that share a frame get merged only when profiling says draw calls matter.
- **Blender.**
  - Export GLB compressed with meshopt via gltf-transform, not Draco. Draco's decoder alone is 147 kB gzip in solar-system's build.
  - Name nodes `piece:<id>` and `hinge:<id>`, with the origin on the hinge line.
  - Blender materials are thrown away on load in favour of the paper material.
  - Blender pieces are rigid children of a mechanism node. Blender never owns kinematics.
  - Block-outs from reference images are for reference only; their numbers get copied into `definition.ts`.
  - `GLTFLoader` and the meshopt decoder load only for spreads that use a Blender piece.

## 5. Paper Material and Lighting

- **Material.** `MeshStandardMaterial` (roughness about 0.9, metalness 0), with one shared instance per stock so there are only a few shader programs. Call `compileAsync` before the canvas is shown.
- **Fibre and edges.** Small tileable normal and roughness maps as WebP or AVIF, around 1024². Skipping KTX2 means no Basis transcoder. Cut edges are flat, slightly warmer and darker, and rougher.
- **Light through thin card.** `onBeforeCompile` adds a back-light term: strength × max(0, −N·L).
  - It's gated by one cheap shadow lookup offset through the card's thickness, so a back face only glows when its front is lit.
  - Accent stock glows with its own tint.
- **Lamp.**
  - A warm `SpotLight` with penumbra and physical decay. It needs a single perspective shadow map, where a point light would need six.
  - The shadow camera is fitted tightly to the book for every lamp position. The book never moves, so texel density stays high.
  - Shadow map 2048² on desktop, 1024² on mobile.
- **Fill.** A `HemisphereLight` with a warm "bounced paper" ground colour. White on white looks dead without bounce light.
- **Tone mapping.** `NeutralToneMapping`, which keeps white white and the accents true. A/B it against AgX in the spike.
- **Soft shadows** are D3.
  - If creases look like they float, add an analytic crease AO. Every hinge and its angle are known, so darken by distance to the crease times how closed the fold is.
  - That's nearly free, whereas SSAO or GTAO would be desktop-only.
- **Desk.** A shadow-catcher plane whose alpha fades radially, over the CSS desk colour, so the edge of the stage is invisible.
- **Pointer lamp.**
  - `pointermove` (passive, mouse and pen only) at document level.
  - The pointer maps to azimuth and elevation inside a bounded cap, which avoids grazing angles, shadow acne and peter-panning. It's smoothed with a spring.
  - On touch, the lamp drifts on a slow Lissajous path inside a smaller cap, as a pure function of time.
  - When the pointer leaves, the lamp eases back to its canonical pose, which is also the pose used for the stills.
- **Mobile tier.** 1024² shadow map, PCF, no shadow lookup for translucency, coarser curve flattening.

## 6. Performance and Loading

- **Loading sequence.**
  - First paint is the prerendered HTML plus the cover still: `<enhanced:img>` with an AVIF/WebP srcset, width and height, `fetchpriority="high"`, preloaded, never lazy.
  - Then, in idle time: import the chunk, build, `compileAsync`, render hidden, and swap once that frame has been presented.
  - The stage is a fixed aspect-ratio box, and the camera, lamp and framing match the still exactly, so the swap is invisible. One aspect ratio at every size means one set of stills.
- **Budget** is D10. Measure the spike's chunk with rollup-plugin-visualizer, then enforce the result in CI.
- **DPR and quality.**
  - DPR is capped at 1.5 with MSAA on. The shader-era 0.5× on mobile would wreck thin card edges.
  - A pure quality governor with hysteresis steps DPR down from 1.5 to 1.0, then drops the shadow tier, when p95 frame time stays over budget. The budgets are 16.7 ms on desktop and 33 ms on mobile.
  - Below the lowest tier, the stage goes to `failed` and shows stills.
- **Render only when something changed.**
  - A frame is needed when the scroll target differs from what's rendered, a spring is still settling, the lamp is moving, or after a resize or asset load. Otherwise call `setAnimationLoop(null)`.
  - `shadowMap.autoUpdate = false`, re-rendering shadows only when something changed.
  - Stop when the tab is hidden or the stage is off-screen.
  - On touch, drift-only frames are capped at 30 fps.
- **INP.** The scroll handler only stores `scrollY`, there are no per-frame layout reads, and geometry builds are chunked.
- **CLS.** The stage box is reserved up front, and the still and the canvas share it.

## 7. Accessibility

- **Still mode.** How the stills are produced is D6.
  - Triggered by reduced motion, the toggle being off, no WebGL 2, a lost context, or the quality governor hitting its floor.
  - It shows the active spread's still, fully open, and swaps instantly when `activeSection` changes.
  - If motion is off from load, three is never imported.
- **Toggling at runtime.**
  - Turning motion off stops the loop and shows the still. The context is kept, paused, so turning it back on is instant.
  - Turning motion on imports the chunk if needed and swaps after the first frame.
- **Decorative contract.** The stage wrapper has `aria-hidden="true"` and stills have `alt=""`. All content is in the HTML column, on a surface token.
- **WCAG 2.2.2.** The touch drift is automatic motion lasting more than 5 seconds. The motion toggle covers it, so the toggle has to stay reachable on phones.
- **WCAG 2.3.1.** A fast riffle sweeps large shadows across the stage. The spring's maximum angular speed caps it at two turns per second or fewer.
- **WCAG 1.4.10.** At 400% zoom the viewport is about 320 × 256 CSS px, and a sticky stage would eat it. Unstick below a named minimum viewport height (D5).
- **Smooth scroll** is off under reduced motion.
- **Checklist.** Keep `DESIGN_SYSTEM.md` §6 and add: still mode tested on its own, a launch with WebGL disabled, 320 px wide, and NVDA in both modes.

## 8. Testing

- **Node tests** (`test/lib/book/**`, mirroring `src/lib/book/**`):
  - V-fold wings stay rigid: the glue-to-crease angle is constant to within 1e-6 rad across φ.
  - Four-bar link lengths stay constant.
  - Everything is flat at φ = 0, and the pose changes continuously with φ.
  - Every spread passes its validation suite.
  - Leaf-to-open mapping.
  - Scroll map: monotonic, windows don't overlap, and each turn's midpoint lands on a section boundary.
  - Springs, lamp bounds, quality governor, path parser.
  - The accent colours in CSS and TS match.
- **jsdom tests:**
  - `BookController` lifecycle, using three mocks in the style of solar-system's `SceneController.test.ts`. Dispose must stop the loop, remove listeners, and dispose geometry, materials and textures; solar-system's `REVIEW.md` items M3 and M4 are exactly these leaks.
  - `BookStage` never imports the scene in still mode (mock the dynamic import), swaps after the first frame, and falls back to stills when the context is lost.
- **Benchmarks.** Port `bench`, `bench:ci` and `check-bench.ts` from solar-system. Bench the per-frame solve for two spreads and a full spread build.
- **Manual and visual.**
  - A dev-only capture mode, `?spread=&open=&lamp=`.
  - A checklist per spread at open 0, 0.25, 0.5, 0.75 and 1, plus the lamp at its extremes.
  - Real-device performance passes.
  - No pixel-diff tests of WebGL; they're flaky across GPUs. Browser tests in CI are D12.

## 9. Deployment

- **Build.** `adapter-static`, `prerender = true`, SSR on, `strict: true`.
- **Workflow.**
  - Fix the project name (D11 decides the target).
  - Restore `on: workflow_run`.
  - Check out `ref: ${{ github.event.workflow_run.head_sha }}`. As written, it would deploy whatever is on main at deploy time, not the commit that passed Check.
  - Pin `bun-version` instead of `latest`.
- **Caching.** Add `static/_headers` with immutable caching for `/_app/immutable/*`. Stills go through Vite, so they get hashed names too.
- **Cleanup.**
  - Delete the `process-images` script entry from `package.json`: `scripts/process-images.ts` doesn't exist.
  - Move `@vitest/browser` out of `dependencies`. Nothing imports it or `vitest-browser-svelte`.
- **CSP.** If one is added like solar-system's, include the hash of the inline `data-motion` script.

## 10. Teardown (Phase 2)

Teardown doesn't depend on the spike's result, since Liquid Light is out either way.

- Delete `src/lib/shader/ShaderCanvas.svelte`, `src/lib/sections/ParallaxController.svelte` and their tests.
- Remove `.parallax-layer-*` and the `--scroll-offset` notes from `src/lib/styles/global.css`.
- Remove `--surface-glass*`, `--cool-*` and `--warm-*` from `src/lib/styles/tokens.css`, along with the glass panels in the Hero, About and Contact sections.
- `--cool-bright` is still doing real work: links, the hero CTA and the contact border. Swap it for a temporary neutral `--link` token that passes contrast until the new palette lands, and re-check `--focus-ring` at the same time.
- Rename `shaderStore` to `sectionStore` and update the nav, the tracker and their tests.
- Delete the empty `src/routes/demo/+page.svelte`, which would otherwise prerender a blank `/demo`.
- Replace the `ProjectsSection`/`ProjectCard` grid with one section per spread (D9).
- `DESIGN_SYSTEM.md`: add a banner saying the visual sections are obsolete, then rewrite it in Phase 7.

---

## Decided

| ID  | Decision                                                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **three.js directly, `0.187.0` pinned.** Reuses solar-system's factory, controller, sizer, mocks and disposal lessons. The hard parts are pure maths feeding a flat, matrix-driven scene graph, which a declarative library wouldn't help with. (Rejected: Threlte, WebGPURenderer.) |
| D8  | **Raised-relief cover.** Cut letters on thin spacers, not moving; the lamp does the work. The first 3D frame matches the LCP still exactly. Contact's envelope goes on the last inside spread, because a closed book's outside has no fold to drive a pop-up.                        |

## Open Decisions

These get settled at the spike gate. The tech lead's recommendation is listed first in each.

- **D2. SvelteKit 3**
  - Migrate in Phase 2, before new code: `sv migrate sveltekit-3`, config into `vite.config.ts`, `$lib` to `#lib` with extensions, tsconfig extends `$app/tsconfig`, Svelte ≥ 5.57.1, Vite ≥ 8.0.12, then `adapter-static@4`. The codebase is at its smallest now.
  - Or stay on 2.70.x with `adapter-static@3` and migrate after launch, on a bigger codebase.
  - Or migrate just before launch. Avoid that: it touches every file after testing is done.
- **D3. Soft shadows**
  - PCSS through a patched shadow chunk on desktop, PCF on mobile, confirmed side by side in the spike. It's contact-hardening, like real paper under a lamp. The cost is about 34 taps per fragment, patching internal chunks, and linearising the spot light's depth.
  - Or `PCFShadowMap` everywhere: cheapest, but the uniform blur makes contact edges float.
  - `VSMShadowMap` is likely broken for the tunnel spread, because light bleeds where occluders overlap in depth.
- **D4. Stage footprint on desktop**
  - A bounded sticky stage: a fixed aspect-ratio box in its own column, with a transparent canvas over the CSS desk colour. Fewer pixels, an exact still swap and clean stacking on phones.
  - Or a full-viewport canvas behind everything. More atmospheric, but about twice the pixels, and the framing changes with aspect ratio.
- **D5. Phone layout**
  - A sticky book band at the top, with text scrolling under it. It unsticks below a named minimum viewport height, showing only the cover still.
  - Or the canvas moves into each section's slot, with no page turns on phones.
  - Or stills only on phones, kept as the quality governor's fallback.
- **D6. How stills are produced**
  - A local `bun run stills`: Playwright drives `vite dev` in capture mode on your GPU, plus a hash of the inputs that CI checks. The stills are pixel-identical to the live first frame.
  - Or the same capture in CI. Chrome's software WebGL is now opt-in and slow.
  - Blender renders won't match the live render, so they're broken for the cover swap.
  - Rendering one live frame is broken for no-WebGL users.
- **D7. Shape authoring**
  - `d` strings in each `definition.ts`, with a small parser. The fewest moving parts.
  - Or draw in a vector tool and convert with `bun run shapes`.
  - Shipping SVG files parsed at runtime: avoid.
- **D9. Sections and nav**
  - One DOM section per spread, generated from the registry, with the rail showing every spread.
  - Or keep a "Projects" wrapper section and a four-dot rail.
- **D10. JS budget**
  - Split it: initial JS ≤ 150 kB gzip, the deferred 3D chunk ≤ 200 kB gzip, textures ≤ 250 kB, enforced in CI. Final numbers come after the spike measures.
  - Keeping one 150 kB budget is probably unachievable with three on the route.
- **D11. Cloudflare target**
  - A new Pages project with `--project-name=portfolio`, same setup as the blog and solar-system.
  - Or Workers static assets, which Cloudflare now recommends for new projects.
  - Side question: Access-protected previews before launch?
- **D12. Browser tests in CI**
  - A small Chromium-only Playwright suite: axe in both modes, still mode end to end, and the fallback with WebGL disabled.
  - Or Vitest plus a manual checklist only.

---

## Phased Build Plan

### Phase 1: V-fold Spike (throwaway) [M]

**Where.** On `main`, in the working tree, never committed. Start from a clean tree, so commit the docs first.

- Keep the spike in its own folders: `src/routes/spike/`, `src/lib/spike/`, `test/lib/spike/`, and `static/spike/` for the printable template.
- The one tracked file it touches is a temporary guard in `src/routes/+layout.svelte`, which skips the old site shell on `/spike`. Without it the Liquid Light shader keeps rendering behind the spike and skews the frame timings.
- Discarding it means deleting those folders and restoring `src/routes/+layout.svelte`, `package.json` and `bun.lock` (plus any other tracked file the build report lists).
- Don't stage or commit any of it.
- No time-box (Shane's call, 2026-11-26).

**What to build.**

- A three.js route with two rigid leaves that have thickness, lying on a desk.
- On one spread, a tiny real motif:
  - a mountain as the V-fold, with its apex on the gutter;
  - a gabled house front as the parallel fold (a general four-bar standing flat).
- A 1:1 printable SVG template of both pieces (outlines, crease lines, glue tabs, in mm) at `static/spike/template.svg`, generated from the same shape data, so the real card fold matches the render.
- The camera's position and angle, written down in the spike, so the reference photo can be taken from the same viewpoint.
- Page scroll scrubs the leaf from θ = 0 to π.
- A spot-light lamp that follows the pointer.
- The paper material with fibre, cut-edge material and the translucency term.
- A PCF/PCSS toggle in the query string, the DPR cap, MSAA and a frame-time overlay.

**Needed from Shane:**

- Print `static/spike/template.svg` at 100%, then cut, fold and glue the two pieces into a two-page card spread. Photograph it under a desk lamp from the viewpoint the spike gives.
- Find three people for the blind check.
- Find a mid-range Android phone to test on.

**"Convincing" means all of these:**

1. **Mechanics (tested):** V-fold wing angle drift under 1e-6 rad across φ from 0 to π in 1° steps. No piece-to-piece or piece-to-page intersection at any step, and both pieces fold completely flat inside the page at φ = 0.
2. **Matches the photo:** at the same lamp angle, the render has the same shadow structure. Contact at glue lines and creases is crisp, the penumbra widens with distance, and faces separate by light alone, with no outlines.
3. **Blind check:** show a 10-second capture to three people (one a designer if possible) with no context. At least two describe it as paper or card, not "3D model" or "plastic".
4. **Lamp:** it swings across its full range with no acne, peter-panning or shimmer.
5. **Scroll:** scrubbing feels attached to the scroll, with no long tasks over 50 ms while scrolling.
6. **Performance:** desktop p95 ≤ 16.7 ms at DPR 1.5 with the chosen shadows, and the reference Android at p95 ≤ 33 ms on the mobile tier.
7. **Measured:** the gzip size of the spike's 3D chunk, which feeds D10.

**Rethink the direction if any of these happen:**

- Only PCSS reads as paper, and the phone can't hold 33 ms even at DPR 1 with 1024² PCF. The choices then are live 3D on desktop with stills on phones, or a deliberately less photoreal look. Baking is ruled out because pieces move.
- The rigid leaf turn reads as "a 3D model of a book". Fixing that means bending pages, which is a much bigger build.
- The chunk is over about 250 kB gzip with no obvious cut. Revisit D10.

**Gate:** review the results, settle D3, D10 and the other open decisions, then discard the spike.

### Phase 2: Foundation and Still-Mode Book [L]

- **Work:**
  - SvelteKit 3 (D2) and adapter-static.
  - Deploy fix and previews (D11).
  - Teardown (§10).
  - Registry, `sectionStore` and per-spread sections (D9).
  - Sticky stage layout with placeholder stills (D4, D5).
  - The inline `data-motion` script and the self-initialising motion store.
  - The stage state machine, the CI size check and Playwright (D12).
- **Exit:** the whole site works end to end in still mode at 320 px, 200% and 400% zoom, and axe is clean. The reduced-motion version gets built first; live mode only ever adds to it.

### Phase 3: Engine [XL]

- **Work:**
  - The mechanics library, with its validation and clipping suite and benchmarks.
  - Path parser and extrusion.
  - Factory, controller and sizer ported from solar-system.
  - Leaves, scroll map and springs.
  - Paper material, lamp, the chosen shadows and the quality governor.
  - Render on demand, the still-to-live swap and capture mode.
- **Exit:** a blank-paged book with the right number of leaves turns under scroll, the cover swap is invisible, and budgets are met on desktop and on the reference phone.

### Phase 4: Stills Pipeline [S]

- **Work:** `bun run stills` (D6), the enhanced-img wiring and the hash check in CI. Also connect the Blender MCP add-on here and test one block-out round trip; it's off the critical path.
- **Exit:** stills regenerate for every spread with one command.

### Phase 5: Spreads, One at a Time [L each]

- **Order:** cover, then the db-documenter map room, the travel tunnel, the About workbench, and the Contact envelope (last inside spread).
- **Each spread goes through:**
  - Silhouettes and accent, with a design review against the creative direction.
  - Its mechanism definition, with the validation suite green.
  - Stills regenerated.
  - A performance check on the reference phone and an a11y spot check.
- One spread is finished before the next starts.

### Phase 6: solar-system Orrery [L, conditional]

- Only if solar-system is ready. The book must already pass Phase 7 without it.
- The swinging rings need their own mechanism study; they aren't a standard V-fold.

### Phase 7: Hardening [M]

- The full a11y audit, including NVDA in both modes.
- Lighthouse on mobile.
- Real devices: iOS Safari and Android Chrome. Plus Firefox.
- Rewrite `DESIGN_SYSTEM.md` and the README.

### Phase 8: Launch [S]

- Production deploy, custom domain, smoke test.

---

## Risks, Ranked

1. **Stalling.** Five or six bespoke spreads, no deadline, an all-at-once launch, and the last attempt sat idle for four months.
   - _Mitigation:_ spike first; building still mode first means a complete book exists early; one spread at a time behind an exit gate; previews on a real phone keep it tangible.
2. **White on white looks CG.** The crux is soft-shadow quality against the phone's frame budget.
   - _Mitigation:_ compare the spike against a real photo; PCSS on desktop and PCF on mobile; bounce fill; crease AO.
3. **Mechanics that look fake or clip.**
   - _Mitigation:_ closed-form four-bar solvers, V-fold concurrency enforced by the types, and sampled validation and intersection tests for every spread in CI.
4. **Bundle size and LCP.** three dominates the deferred chunk.
   - _Mitigation:_ the cover still as LCP, a lazy chunk, the lint rule, the CI size check, and no Draco.
5. **Shadow precision at card scale.** Card is about 0.3–0.5 mm, roughly one shadow-map texel, so expect acne and light leaks at glue lines.
   - _Mitigation:_ exaggerate the thickness slightly, keep the shadow frustum tight, and tune `normalBias`.
6. **Stills and live render drifting apart.** That shows up as a jump at the cover swap, or as stale stills.
   - _Mitigation:_ the same renderer produces the stills, and CI checks the hash.
7. **three.js upgrades.** Minor releases break APIs, and PCSS patches internal chunks.
   - _Mitigation:_ pin the exact version and upgrade deliberately with the visual checklist.
8. **Sticky stage vs zoom and reflow.**
   - _Mitigation:_ the unstick rule and tests at 320 px.
9. **Flashing on fast riffles (WCAG 2.3.1).**
   - _Mitigation:_ the maximum leaf angular speed.
10. **Blender MCP unknowns.** It isn't connected yet. It's off the critical path by design, since geometry is generated in code by default.
11. **The deploy workflows target the blog's Cloudflare project** (in both this repo and solar-system). Trivial to fix, severe if missed.

---

## Sources

- [three on npm](https://registry.npmjs.org/three/latest), [three.js releases](https://github.com/mrdoob/three.js/releases), [three.js migration guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide), [PCSS example (r187)](https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/webgl_shadowmap_pcss.html)
- [@threlte/core on npm](https://registry.npmjs.org/@threlte/core/latest)
- [@sveltejs/kit on npm](https://registry.npmjs.org/@sveltejs/kit), [@sveltejs/adapter-static on npm](https://registry.npmjs.org/@sveltejs/adapter-static/latest). SvelteKit docs via the Svelte MCP: adapter-static, page options, Cloudflare, migrating to v3, images.
- [@pmndrs/vanilla (pcss)](https://socket.dev/npm/package/@pmndrs/vanilla)
- [Cloudflare: migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/), [Cloudflare: Pages and Workers converging](https://blog.cloudflare.com/pages-and-workers-are-converging-into-one-experience/)
- [Chromium SwiftShader docs](https://chromium.googlesource.com/chromium/src/+/da170c2267b2201954efe1c8fa5d2d89ab09f7bf/docs/gpu/swiftshader.md)
