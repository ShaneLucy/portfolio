# Technical Plan: Pop-up Book

_Written 2026-11-26 from the tech-lead review. `CREATIVE_DIRECTION.md` is the source of truth for what's being built. This doc covers how._

---

## Status

- **Phase 1 is done.** The V-fold spike was built, reviewed and discarded on 2026-11-26. Its results and lessons are under Phase 1.
- **Every decision, D1–D25, is settled.** They're listed under [Decisions](#decisions). D14–D25 were settled when planning Phase 2.
- **Phase 2 is under way. Step 1 (teardown) is done.** Its ordered steps, and the questions left for particular steps, are under Phase 2.

---

## Facts That Shaped the Plan (checked 2026-11-26)

- **Both deploy workflows target the blog.** `.github/workflows/deploy.yml` and `../solar-system/.github/workflows/deploy.yml` both deploy with `--project-name=blog`, the blog's Cloudflare Pages project. Neither runs today: their `on:` blocks are commented out, which GitHub treats as invalid. Fix this before either is switched back on.
- **SvelteKit 3 is `latest` (3.4.1).** The 2.x line continues as 2.70.4, and `@sveltejs/adapter-static` 4.x requires Kit 3.
- **three.js is at r187 (`0.187.0`).** r186 removed `PCFSoftShadowMap`, and plain `PCFShadowMap` has been soft since r182. r187 stopped `setViewport` and `setScissor` scaling by pixel ratio. solar-system's `RendererSizer` sets the pixel ratio to 1, so it should be unaffected; verify that when porting it.
- **Bundle size.** solar-system's 3D route chunk (r185, the GLTF, Draco and KTX2 loader wrappers, and scene code) is about 722 kB raw, about 190 kB gzip. The book's chunk will be smaller, but three dominates it, so the 150 kB-per-route budget needs a decision (D10).

**Checked again while planning Phase 2 (2026-11-26):**

- **The baseline isn't green** (corrected 2026-11-27).
  - Locally, `prettier --check` failed on `package.json` and `src/routes/+layout.svelte` (fixed in step 1). CI's format step passed on the same commit, so the local failures were most likely CRLF line endings: git's system config sets `core.autocrlf=true`, and the repo has no `.gitattributes`.
  - Check fails at **Lint**, not Format. The logs need a sign-in, but the step results are public through the GitHub API.
    - CI installs with `--ignore-scripts`, so `svelte-kit sync` never runs and `.svelte-kit/tsconfig.json` doesn't exist.
    - Without it, the tsconfig includes `vitest.config.ts`, which clashes with that file's `allowDefaultProject` entry in `eslint.config.js`. This was reproduced locally by removing `.svelte-kit`.
    - Even after a sync, Lint fails some of the time. `eslint.config.js` gives the `.ts` block `allowDefaultProject: ["vitest.config.ts", …]` and the `.svelte` block plain `projectService: true`. typescript-eslint builds one project service from whichever file it lints first, so when a `.svelte` or `.svelte.ts` file goes first, `vitest.config.ts` is "not found by the project service". This was reproduced by linting two files in each order.
  - Nothing after Lint had run in CI since July. Locally, coverage passes, with branches at 80.35% against an 80% threshold.
  - After step 1b, Lint, Type check and Unit tests pass in CI, and the SonarQube scan fails. The repo had no `SONAR_TOKEN` secret. Shane added one on 2026-11-27, and its first run is still unverified.
  - Deploy only fires after a green Check, so Check must be fixed before any deploy.
- **Versions.**
  - Kit 3.4.1 needs Svelte ≥ 5.57.1, Vite ≥ 8.0.12 and Node ≥ 22.17.
  - adapter-static is at 4.0.1.
  - TypeScript's `latest` on npm is 7.0.2, but Kit, svelte-check and typescript-eslint all cap at 6, so the project stays on 6.0.x.
- **The migration.**
  - `sv migrate sveltekit-3` has to run as one pass (`--tasks all`). The docs say a partial run leaves the project broken.
  - It moves config into `vite.config.ts`, rewrites `$lib` to `#lib`, and switches tsconfig to `$app/tsconfig`.
  - It doesn't switch adapters.
  - The generated tsconfig lives in `node_modules/$app`, so CI needs `svelte-kit sync` before eslint.
- **Prerendering checks anchors.** Prerendering fails the build on a same-page `#id` link with no matching id.
- **Cloudflare.**
  - Workers "preview URLs" are now called version URLs.
  - Branch previews (`wrangler preview`) are public by default.
  - A Worker's Access tab can protect "All traffic" (`workers.dev` and previews) or "Previews only". It needs Zero Trust turned on.
  - `_headers` is honoured for static assets, and goes in the assets directory.
- **Initial JS** for `/` is about 41 kB gzip today.

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
- **Keep three out of the initial chunk.**
  - An ESLint `no-restricted-imports` rule allows `three` only under `src/lib/book/scene/**`. It goes in during Phase 2 (D25).
  - A CI size check measures what `build/index.html` loads (D24).
  - solar-system's `check-bench.ts` pattern doesn't carry over: adapter-static doesn't copy the Vite manifest into `build/`.
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
  - Today's tracker doesn't guarantee that. It picks the section whose centre is nearest the viewport middle, so the switch point drifts with section height. On phones, the viewport middle isn't the middle of the text below the band either. This gets settled in Phase 2, step 6.
  - Sections get a min-height so turn windows can't overlap. jsdom has no layout, so the min-height is a TS constant applied as an inline custom property, and the test checks the constant.
- **Smoothing.** The rendered leaf angle follows its scroll target through a critically damped spring with a maximum angular speed. Mouse-wheel steps come out smooth, and anchor jumps riffle through the pages instead of teleporting.
- **Stores.** `shaderStore` becomes `sectionStore`, since it only holds the active section now. `SectionId` derives from the registry. `motionStore` stays.
- **Bug to fix along the way.** `motionStore.init()` runs in `MotionToggle`'s `onMount`. If `BookStage`'s effect runs first, it sees the default "motion on" and starts downloading three for a reduced-motion user.
  - Make the store initialise itself on its first browser read.
  - Add a tiny inline head script that sets `data-motion` on `<html>` from the same localStorage key, so CSS picks the right mode before first paint.
- **The stage state machine is a pure function.** Its states are `still | loading | live | failed`. Its inputs are: the motion setting, WebGL 2 availability, a viewport below the minimum height (D18), chunk loaded, first frame presented, context lost, and quality floor breached. It's unit-testable, and it's what guarantees reduced-motion users never download three.

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
- **Pure and unit-tested:** all of the above, plus the leaf-to-open mapping, scroll map, springs, lamp-pose interpolation, quality governor and the stage state machine.

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
- **Tone mapping.** `NeutralToneMapping`, which keeps white white and the accents true. A/B it against AgX in Phase 3.
- **Soft shadows (D3):** PCSS on every device to start with, and the quality governor steps down to PCF when a device misses budget.
  - If creases look like they float, add an analytic crease AO. Every hinge and its angle are known, so darken by distance to the crease times how closed the fold is.
  - That's nearly free, whereas SSAO or GTAO would be desktop-only.
- **Desk.** A shadow-catcher plane whose alpha fades radially, over the CSS desk colour, so the edge of the stage is invisible.
- **Lamp poses, one per spread (D13).**
  - Each spread's definition includes a lamp pose: azimuth, elevation and distance, kept inside a safe range that avoids grazing angles, shadow acne and peter-panning.
  - During a page turn, the lamp interpolates from the outgoing spread's pose to the incoming one's, driven by the same eased turn progress as the leaf.
  - The shadow camera is refitted for each pose.
  - Each spread's still uses that spread's pose.
  - There's no pointer input and no automatic drift.
- **Mobile tier.** 1024² shadow map, PCF, no shadow lookup for translucency, coarser curve flattening.

## 6. Performance and Loading

- **Loading sequence.**
  - First paint is the prerendered HTML plus the cover still: `<enhanced:img>` with an AVIF/WebP srcset, width and height, `fetchpriority="high"`, preloaded, never lazy.
  - Then, in idle time: import the chunk, build, `compileAsync`, render hidden, and swap once that frame has been presented.
  - The stage is a fixed aspect-ratio box, and the camera, lamp and framing match the still exactly, so the swap is invisible. One aspect ratio at every size means one set of stills.
- **Budget (D10):** initial JS ≤ 150 kB gzip, the deferred 3D chunk ≤ 200 kB gzip, textures ≤ 250 kB, all enforced in CI. The spike's chunk (three.js plus a whole scene) measured 152 kB.
- **DPR and quality.**
  - DPR is capped at 1.5 with MSAA on. The shader-era 0.5× on mobile would wreck thin card edges.
  - A pure quality governor with hysteresis steps down when p95 frame time stays over budget. The budgets are 16.7 ms on desktop and 33 ms on mobile.
  - The steps run from PCSS to PCF (2048²), then DPR 1.5 to 1.0, then PCF at 1024².
  - Every device starts on PCSS (D3), so the first evaluation window has to be short. A weaker phone (the Galaxy S9 measured 35 ms on PCSS) should step down within a second or two, not stutter for longer.
  - Below the lowest tier, the stage goes to `failed` and shows stills.
- **Render only when something changed.**
  - A frame is needed when the scroll target differs from what's rendered, a spring is still settling, or after a resize or asset load. The light only moves during page turns, so a settled spread renders nothing. Otherwise call `setAnimationLoop(null)`.
  - `shadowMap.autoUpdate = false`, re-rendering shadows only when something changed.
  - Stop when the tab is hidden or the stage is off-screen.
- **INP.** The scroll handler only stores `scrollY`, there are no per-frame layout reads, and geometry builds are chunked.
- **CLS.** The stage box is reserved up front, and the still and the canvas share it.

## 7. Accessibility

- **Still mode.** The stills come from the local capture script (D6, Phase 4).
  - Triggered by reduced motion, the toggle being off, no WebGL 2, a viewport below the minimum height (D18), a lost context, or the quality governor hitting its floor.
  - It shows the active spread's still, fully open, and swaps instantly when `activeSection` changes.
  - If motion is off from load, three is never imported.
- **Toggling at runtime.**
  - Turning motion off stops the loop and shows the still. The context is kept, paused, so turning it back on is instant.
  - Turning motion on imports the chunk if needed and swaps after the first frame.
- **Decorative contract.** The stage wrapper has `aria-hidden="true"` and stills have `alt=""`. All content is in the HTML column, on a surface token.
- **WCAG 2.2.2.** There's no automatic motion. The pages and light move only with scroll, so nothing on the stage moves by itself.
- **WCAG 2.3.1.** A fast riffle sweeps large shadows across the stage. The spring's maximum angular speed caps it at two turns per second or fewer.
- **WCAG 1.4.10.** At 400% zoom the viewport is about 320 × 256 CSS px, and a sticky stage would eat it. Unstick below a named minimum viewport height (D5).
- **Smooth scroll** is off under reduced motion and when the toggle is off. Today `reset.css` only follows the OS setting; the `data-motion` attribute fixes that.
- **Fixed chrome (D19).** At 400% zoom the fixed header and the section pill would cover most of the viewport, which fails 1.4.10 and 2.4.11 (Focus Not Obscured).
- **Checklist.** Keep `DESIGN_SYSTEM.md` §6 and add: still mode tested on its own, a launch with WebGL disabled, 320 px wide, and NVDA in both modes.

## 8. Testing

- **Node tests** (`test/lib/book/**`, mirroring `src/lib/book/**`):
  - V-fold wings stay rigid: the glue-to-crease angle is constant to within 1e-6 rad across φ.
  - Four-bar link lengths stay constant.
  - Everything is flat at φ = 0, and the pose changes continuously with φ.
  - Every spread passes its validation suite.
  - Leaf-to-open mapping.
  - Scroll map: monotonic, windows don't overlap, and each turn's midpoint lands on a section boundary.
  - Springs, lamp poses within their safe range, lamp-pose interpolation, quality governor, path parser.
  - The accent colours in CSS and TS match.
- **jsdom tests:**
  - `BookController` lifecycle, using three mocks in the style of solar-system's `SceneController.test.ts`. Dispose must stop the loop, remove listeners, and dispose geometry, materials and textures; solar-system's `REVIEW.md` items M3 and M4 are exactly these leaks.
  - `BookStage` never imports the scene in still mode (mock the dynamic import), swaps after the first frame, and falls back to stills when the context is lost.
- **Benchmarks.** Port `bench`, `bench:ci` and `check-bench.ts` from solar-system. Bench the per-frame solve for two spreads and a full spread build.
- **Manual and visual.**
  - A dev-only capture mode, `?spread=&open=`.
  - A checklist per spread at open 0, 0.25, 0.5, 0.75 and 1, plus mid-turn, where the light sits between two spreads' poses.
  - Real-device performance passes.
  - No pixel-diff tests of WebGL; they're flaky across GPUs.
  - No browser tests in CI (D12). axe, still mode end to end, and the no-WebGL fallback are checked by hand, using this checklist and the one in §7.

## 9. Deployment

- **Build.** `adapter-static`, `prerender = true`, SSR on, `strict: true`.
- **Target (D11, D22): Workers static assets.**
  - An assets-only `wrangler.jsonc` (no `main`) points `assets.directory` at `./build`. Deploys use `wrangler deploy` rather than `pages deploy`.
  - Before launch, every green main deploys to the Worker's `workers.dev` URL, with Access set to "All traffic", so only Shane can open it.
- **Shane's dashboard steps.**
  - Turn on Zero Trust if it's off.
  - Make a token from the "Edit Cloudflare Workers" template and replace `CLOUDFLARE_API_TOKEN`. The Pages-era token almost certainly lacks Workers Scripts: Edit.
  - After the first deploy, open the Worker's Access tab, choose "All traffic", and add a policy for his email.
- **Workflow.**
  - Fix Check first (Phase 2 step 1b; see Facts). Deploy only runs after a green Check.
  - Replace the `pages deploy --project-name=blog` step with a Workers deploy, and re-pin `cloudflare/wrangler-action` from v4.0.0 to v4.1.3.
  - Restore `on: workflow_run`.
  - Check out `ref: ${{ github.event.workflow_run.head_sha }}`. As written, it would deploy whatever is on main at deploy time, not the commit that passed Check.
  - Pin `bun-version` to the local version (1.3.14) instead of `latest`, in both workflows. `check.yml` gets it in step 1b.
  - Pin Node 24 with `setup-node` (D23), in both workflows. `check.yml` gets it in step 1b.
  - Run `svelte-kit sync` after `bun install --ignore-scripts` and before eslint (`check.yml`, step 1b).
- **Caching.** Add `static/_headers` with immutable caching for `/_app/immutable/*`. Workers static assets honours `_headers`. Its default is `public, max-age=0, must-revalidate`, so use `! Cache-Control` to replace it. Stills go through Vite, so they get hashed names too.
- **Cleanup.**
  - Delete the `process-images` script entry from `package.json`: `scripts/process-images.ts` doesn't exist.
  - Remove `@vitest/browser` and `vitest-browser-svelte`. Nothing imports either, and D12 rules out browser tests.
  - Remove the `eslint.config.js` override for `src/lib/images.ts`, which doesn't exist.
- **CSP: deferred to Phase 7.** A CSP in `_headers` can't work, because Kit's bootstrap script hash changes every build. A `<meta>` CSP would need the inline `data-motion` script's hash maintained by hand.

## 10. Teardown (Phase 2)

Teardown doesn't depend on the spike's result, since Liquid Light is out either way.

- Delete `src/lib/shader/ShaderCanvas.svelte`, `src/lib/sections/ParallaxController.svelte` and their tests.
- Remove `.parallax-layer-*` and the `--scroll-offset` notes from `src/lib/styles/global.css`.
- Remove `--surface-glass*`, `--cool-*` and `--warm-*` from `src/lib/styles/tokens.css`, along with the glass panels in the Hero, About and Contact sections.
- `--cool-bright` is still doing real work: links, the hero CTA and the contact border. Swap it for a temporary neutral `--link` token that passes contrast until the new palette lands, and re-check `--focus-ring` at the same time.
  - About's skill-category labels also use it, but they aren't links, so they take `--text-tertiary`.
  - There's one link tone. The hero CTA's hover (`--cool-accent` today) changes only its underline.
- Leftovers this list first missed:
  - the cyan `--nav-*` tokens and `--focus-ring`, retuned to neutral (D21);
  - `SectionNavItem`'s hard-coded cyan glow, and its text-shadow meant for reading over WebGL;
  - the 1100–1490 px rail padding hack in `global.css` (D16 makes it unnecessary). It goes in step 1, so the rail overlaps the text at those widths until step 10;
  - `color-scheme: dark` in `reset.css`, which stays for now because the palette stays dark (D21);
  - the "Liquid Light" header comments in the style files.
- Rename `shaderStore` to `sectionStore` and update the nav, the tracker and their tests.
- Delete the empty `src/routes/demo/+page.svelte`, which would otherwise prerender a blank `/demo`.
- Replace the `ProjectsSection`/`ProjectCard` grid with one section per spread (D9).
- `DESIGN_SYSTEM.md`: add a banner saying the visual sections are obsolete, then rewrite it in Phase 7.

---

## Decisions

All settled on 2026-11-26.

- **D1. Rendering:** three.js directly, pinned to `0.187.0`. It reuses solar-system's factory, controller, sizer, mocks and disposal lessons. (Rejected: Threlte, WebGPURenderer.)
- **D2. SvelteKit 3:** migrate in Phase 2, before new code. Run `sv migrate sveltekit-3`: config moves into `vite.config.ts`, `$lib` becomes `#lib` with file extensions, tsconfig extends `$app/tsconfig`, Svelte ≥ 5.57.1, Vite ≥ 8.0.12. Then use `adapter-static@4`. The migration runs as one pass and doesn't switch adapters, so swapping adapter-auto for adapter-static is a manual step.
- **D3. Shadows:** PCSS on every device to start with. The quality governor steps a device down to PCF when it misses its frame budget. That gives the best look on capable phones (the iPhone 14 Pro held 18 ms). The cost is that weaker phones stutter briefly before stepping down, so keep the governor's first window short (§6).
- **D4. Desktop stage:** a bounded sticky stage. A fixed aspect-ratio box in its own column, with a transparent canvas over the CSS desk colour.
- **D5. Phones:** a sticky book band at the top, with text scrolling under it and pages turning as on desktop. Below a named minimum viewport height (landscape phones, 400% zoom), it unsticks and shows only a still.
- **D6. Stills:** a local `bun run stills` that captures every spread through the real renderer on Shane's GPU. It writes a hash of the inputs, and CI fails if the stills are stale. See the Playwright lesson in Phase 1.
- **D7. Shapes:** SVG `d` strings in each spread's `definition.ts`, read by a small parser, as in the spike.
- **D8. Cover:** raised relief. Cut letters on thin spacers, not moving, with the cover's light doing the work. Contact's envelope goes on the last inside spread, because a closed book's outside has no fold to drive a pop-up.
- **D9. Sections:** one DOM section per spread, generated from the registry. The rail shows every spread, and the top nav's Projects link points at the first project spread.
- **D10. JS budget:** initial JS ≤ 150 kB gzip, the deferred 3D chunk ≤ 200 kB gzip, textures ≤ 250 kB, all enforced in CI. The spike's chunk measured 152 kB.
- **D11. Cloudflare:** Workers static assets, not Pages. Builds deploy to private preview URLs behind Cloudflare Access before launch.
- **D12. Browser tests:** none in CI. Vitest plus the manual checklists (§7, §8). axe is run by hand.
- **D13. Light:** fixed on every device and placed per spread, easing between poses as pages turn. Scroll is the only interaction, with no pointer lamp and no drift on phones. This replaced the pointer-driven lamp the same day.
- **D14. Sections:**
  - The ids are `hero`, `db-documenter`, `travel-blog`, `about` and `contact`, and the rail's first label is "Home".
  - Each spread is a flat `h2` section, and project spreads carry a visible "Project" eyebrow.
  - The ProjectCard's expand/collapse is dropped, so the full text always shows.
- **D15. Stage aspect ratio: 3:2.** One constant drives the stage box, the phone band, the Phase 3 camera framing and the Phase 4 stills.
- **D16. Desktop layout:**
  - Text on the left (about 40%), the stage on the right (about 60%), and the section rail in its own gutter at the far right.
  - The rail no longer overlaps the text.
- **D17. Layout breakpoint: 1100 px**, shared by the columns and the rail. It's a literal in CSS and a TS constant where JS needs it, and a test checks that the two match.
- **D18. Minimum viewport height: 480 px.** Below it, the stage unsticks and shows only a still (D5). It's an input to the stage state machine.
- **D19. Nav chrome:**
  - On narrow screens, the section pill becomes prev/next, the current label, and "n of N".
  - Below the minimum height, the header goes static, the pill hides, and the motion toggle moves into the header.
- **D20. Placeholder stills:** drawn in CSS or SVG, with no image request. The LCP path (preload and `fetchpriority`) is first tested in Phase 4.
- **D21. Phase 2 palette:**
  - It stays dark.
  - Teardown adds a neutral `--link` and retunes `--focus-ring` and the `--nav-*` tokens to neutral.
  - The real palette comes once the creative questions are settled.
- **D22. Pre-launch deploys:**
  - Every green main deploys to the Worker's `workers.dev` URL, with Access on "All traffic" until launch.
  - There are no branch previews.
  - The Worker is named `portfolio`, and it serves a plain 404.
- **D23. CI runtime:** `setup-node` pinned to Node 24, with bun pinned to the local version. Bun runs Vite under Node when Node is on the PATH, so CI builds on Node and Shane's machine builds on Bun.
- **D24. Size check:**
  - It reads `build/index.html`, follows its modulepreload links and the bootstrap script's imports, and gzips each file.
  - That measures what the browser actually fetches, without relying on Kit's internal manifest numbering.
- **D25. Phase 2 extras:**
  - Remove `@vitest/browser` and `vitest-browser-svelte`.
  - Add the `three` `no-restricted-imports` rule now.
  - MotionToggle gets a fixed "Animations" label with `aria-pressed`. Today it flips both, so it reads "Pause animations, pressed".
  - `reset.css` uses `text-size-adjust: 100%`, not `none`.
  - Set `version.pollInterval: 0`, and pin `typescript` to `~6.0.3`.
  - Each extra lands with the Phase 2 step that already touches the same files (placed 2026-11-27; see Phase 2).

---

## Phased Build Plan

### Phase 1: V-fold Spike (done 2026-11-26)

It was built on `main`, never committed, and discarded after the gate.

**Results:**

- **Mechanics (criterion 1):** passed in tests. The V-fold stayed rigid to within 1e-6 rad at every 1° step, nothing intersected, and everything folded flat when closed.
- **Size (criterion 7):** three.js plus a whole scene came to 152 kB gzip in one lazily loaded chunk.
- **Performance (criterion 6):** at desktop quality (PCSS, 2048² shadow map), an iPhone 14 Pro hit p95 18 ms and a Galaxy S9 hit p95 35 ms. That's 2 ms over the phone budget before any step-down. No desktop figure was recorded.
- **Photo match and blind check (criteria 2 and 3):** skipped, by Shane's choice. He reviewed the spike and judged it will read as paper with refinement.
- **Lamp artefacts and scroll feel (criteria 4 and 5):** not formally checked.

**Lessons for Phase 3:**

- **PCSS patch:** three r187's own PCSS example patches the shadow chunk with a string replace that no longer matches r187's chunk (a blank line differs), so it silently does nothing. Patch against a unique statement instead, and test the patch against the installed shader text so a three.js upgrade fails loudly.
- **Upright faces:** the house four-bar leaned back like one side of a tent at full open, so from the camera it read as a slab, not a house front. A face that should stand upright at 180° needs a mechanism designed for that.
- **Spine gap:** hinging the pages 1 mm above their faces (a 2 mm gap when closed) let thick card fold flat. It leaves about 1.4 mm of slop at the crease mid-fold.
- **Playwright under bun:** `chromium.launch()` hangs under bun on Shane's machine. The spike captured screenshots by running `chrome-headless-shell` directly, and the stills script (D6) will need the same workaround.

### Phase 2: Foundation and Still-Mode Book [L]

- **Work, in order.** Each step goes to one specialist agent, ends green (tests, check and lint, build), and is one commit.
  1. Teardown (§10, except the rename and the sections, which are steps 5 and 6) and baseline fixes: prettier on `package.json` and `+layout.svelte`, the §9 cleanup, `text-size-adjust` (D25), and the `DESIGN_SYSTEM.md` banner.
     - **Step 1b: fix Check**, as its own commit. In `check.yml`: `setup-node` pinned to 24, bun pinned to 1.3.14 (D23), and `svelte-kit sync` before eslint. In `eslint.config.js`: the same `projectService` settings for every block. Plus a `.gitattributes` that keeps line endings LF. It's pushed and green before step 2 starts, so a red Check after the migration is the migration's fault.
     - **Step 1c: dependency CVEs**, as its own commit. `bun update` within the existing ranges, plus a regenerated `bun.lock` so transitive deps move too. `bun audit` went from 81 advisories to 5. sonarjs 4.2's new `parameterized-tests` rule turned two test groups into `it.each` tables.
  2. SvelteKit 3 (D2) and adapter-static, with `prerender = true` in the root `+layout.ts`. Also the `typescript` pin and `version.pollInterval: 0` (D25).
     - The new tsconfig `include` covers root files, so `vitest.config.ts` leaves `allowDefaultProject`.
     - `src/lib/index.ts` is deleted, and only `#lib/*` is mapped, so there's no bare `#lib` barrel.
     - The 5 advisories left after step 1c are fixed only in Kit 3: four in `@sveltejs/kit` itself, and `cookie` < 0.7, which Kit 2 pins at `^0.6.0`. `bun audit` should be clean after this step.
  3. The CI size check (D10, D24) and the `three` `no-restricted-imports` rule (D25).
  4. The Workers deploy (D11, D22, D23), plus Shane's dashboard steps (§9).
  5. Rename `shaderStore` to `sectionStore`.
  6. Registry and per-spread sections (D9, D14). This has to be one commit, because prerendering fails the build on any `#id` link with no target.
  7. The inline `data-motion` script and the self-initialising motion store, plus MotionToggle's label fix (D25).
  8. The stage state machine.
  9. `BookStage` with placeholder stills (D20).
  10. Sticky stage layout, phone band, unstick rule and nav chrome (D4, D5, D15–D19).
- **Still open, decided when their step starts:**
  - Step 6: whether solar-system gets a registry entry before Phase 6 (the lean is no, with test fixtures covering two and three projects), and how the tracker picks the active section (the lean is the section containing the reading line; see §2).
  - Step 7: whether `data-motion` holds the resolved mode, kept current by the store, or only the stored override (the lean is the resolved mode).
  - Step 8: the state machine's shape (a snapshot function or a reducer), its file, whether `failed` lasts for the rest of the session, and whether it's wired in now with live mode switched off (the lean is a snapshot function at `src/lib/book/stage-state.ts`, wired in now).
  - Step 10: the phone band's height (the lean is width ÷ aspect ratio, capped at about 40svh).
- **Exit:** the whole site works end to end in still mode at 320 px, 200% and 400% zoom, and axe (run by hand) is clean. Also check on a real phone through the Access-protected URL. The reduced-motion version gets built first; live mode only ever adds to it.

### Phase 3: Engine [XL]

- **Work:**
  - The mechanics library, with its validation and clipping suite and benchmarks.
  - Path parser and extrusion.
  - Factory, controller and sizer ported from solar-system.
  - Leaves, scroll map and springs.
  - Paper material, per-spread lamp poses, the chosen shadows and the quality governor.
  - Render on demand, the still-to-live swap and capture mode.
- **Exit:** a blank-paged book with the right number of leaves turns under scroll, the cover swap is invisible, and budgets are met on desktop and on the reference phone.

### Phase 4: Stills Pipeline [S]

- **Work:** `bun run stills` (D6), the enhanced-img wiring and the hash check in CI. Also connect the Blender MCP add-on here and test one block-out round trip; it's off the critical path.
- **Exit:** stills regenerate for every spread with one command.

### Phase 5: Spreads, One at a Time [L each]

- **Order:** cover, then the db-documenter map room, the travel tunnel, the About workbench, and the Contact envelope (last inside spread).
- **Each spread goes through:**
  - Silhouettes, accent and lamp pose, with a design review against the creative direction.
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
- Phase 2 planning: [migrating to SvelteKit 3](https://svelte.dev/docs/kit/migrating-to-sveltekit-3), [sv migrate](https://svelte.dev/docs/cli/sv-migrate), [Workers static assets headers](https://developers.cloudflare.com/workers/static-assets/headers/), [Workers versions and deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/), [Workers previews](https://developers.cloudflare.com/workers/configuration/previews/), [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/), [API token templates](https://developers.cloudflare.com/fundamentals/api/reference/template/), [wrangler-action](https://github.com/cloudflare/wrangler-action)
- [Chromium SwiftShader docs](https://chromium.googlesource.com/chromium/src/+/da170c2267b2201954efe1c8fa5d2d89ab09f7bf/docs/gpu/swiftshader.md)
