# Portfolio Design System: Liquid Light

*Created: 2026-06-16 — companion to CREATIVE_DIRECTION.md*

---

## 1. Typography

### Typefaces

| Role | Face | Source | Cost |
|------|------|--------|------|
| **Display / headings** | Fraunces | Google Fonts / fontsource | Free |
| **Body / UI** | Inter | fontsource (`@fontsource-variable/inter`) | Free |

**Why this pairing:** Fraunces is a variable font with an optical-size axis (`opsz`) and an optical weight axis (`WONK`) that produces genuinely different letterform flavours at display vs. text sizes — the kind of detail that reads as taste. Inter is clean, modern, and stays invisible in body copy, letting Fraunces do the expressive work. The variable axes on Fraunces are gated behind `prefers-reduced-motion` (axis animation only; static weight/optical-size assignments always apply).

### Type Scale

Fluid sizing via `clamp()`. Breakpoints implied by viewport width — no hard breakpoints needed. Base = 1rem (user-relative, never overridden).

```css
--text-xs:      clamp(0.64rem,  0.60rem + 0.20vw,  0.75rem);
--text-sm:      clamp(0.80rem,  0.75rem + 0.25vw,  0.875rem);
--text-base:    clamp(1.00rem,  0.925rem + 0.375vw, 1.125rem);
--text-md:      clamp(1.25rem,  1.10rem + 0.75vw,  1.5rem);
--text-lg:      clamp(1.563rem, 1.35rem + 1.05vw,  2rem);
--text-xl:      clamp(1.953rem, 1.60rem + 1.75vw,  2.75rem);
--text-2xl:     clamp(2.441rem, 1.90rem + 2.70vw,  4rem);
--text-3xl:     clamp(3.052rem, 2.20rem + 4.25vw,  6rem);
--text-display: clamp(3.815rem, 2.50rem + 6.50vw,  9rem);
```

### Weight & Style Assignments

| Token | Face | Weight | Use |
|-------|------|--------|-----|
| `--type-display` | Fraunces | 800 (variable) | Hero headline |
| `--type-heading-1` | Fraunces | 700 | Section headings |
| `--type-heading-2` | Fraunces | 600 | Sub-headings, project titles |
| `--type-label` | General Sans | 500 | Navigation, tags, metadata |
| `--type-body` | General Sans | 400 | Body copy |
| `--type-caption` | General Sans | 400 | Captions, footnotes |

### Line Heights & Tracking

```css
--leading-tight:   1.1;   /* display, heading-1 */
--leading-snug:    1.2;   /* heading-2 */
--leading-normal:  1.5;   /* body */
--leading-loose:   1.7;   /* long-form prose */

--tracking-tight:  -0.03em; /* display */
--tracking-normal:  0em;    /* body */
--tracking-wide:    0.08em; /* labels, all-caps */
```

### Accessibility — Typography

- All sizes in `rem`/`clamp()`; never `px` for font sizes
- Survives 200% browser zoom (WCAG 1.4.4) and 400% reflow (WCAG 1.4.10) — single-column at narrow viewport
- Variable font axis animation (weight morphing between sections) gated behind `prefers-reduced-motion: no-preference`
- Contrast checked at **every weight** — Fraunces thin (below 400) is not used for body text; minimum 500 for any text on dark surface
- Fraunces italic used only for display-size accent text where contrast is verified

---

## 2. Colour System

### Colour Space

All tokens authored in **OKLCH**. OKLCH gives perceptually uniform lightness — interpolating between two palette colours in OKLCH produces smooth, accurate gradients without the muddy intermediate hues of RGB or even HSL. The shader also operates in this space via conversion in GLSL.

Format: `oklch(L% C H)` — Lightness (0–100%), Chroma (0–0.4+), Hue (0–360°)

### Surface Tokens (invariant — do not shift with section)

```css
/* Backgrounds */
--surface-base:     oklch(6%  0.012 270);  /* near-black, slight cool tint */
--surface-raised:   oklch(10% 0.015 270);  /* cards, elevated panels */
--surface-overlay:  oklch(14% 0.018 270);  /* modals, expanded states */

/* Text — contrast guaranteed regardless of shader state */
/* Text always sits on a surface token, never directly on the shader canvas */
--text-primary:     oklch(95% 0.008 270);  /* ~19:1 on surface-base */
--text-secondary:   oklch(72% 0.010 270);  /* ~7.5:1 on surface-base — AA large + AA normal */
--text-tertiary:    oklch(55% 0.010 270);  /* ~4.6:1 on surface-base — AA normal minimum */

/* Focus ring */
--focus-ring:       oklch(80% 0.18  195);  /* aqua — visible on dark and on shader */
```

### Cool Palette (aurora, deep water)

```css
--cool-deep:    oklch(22% 0.12  265);  /* deep indigo */
--cool-mid:     oklch(48% 0.18  295);  /* violet */
--cool-bright:  oklch(72% 0.16  195);  /* aqua */
--cool-accent:  oklch(85% 0.12  185);  /* pale cyan highlight */
```

### Warm Palette (bioluminescence, fire)

```css
--warm-deep:    oklch(22% 0.12   35);  /* deep amber */
--warm-mid:     oklch(55% 0.20   50);  /* amber-gold */
--warm-bright:  oklch(78% 0.18   70);  /* gold */
--warm-accent:  oklch(88% 0.14   80);  /* pale gold highlight */
```

### Section → Palette Mapping

| Section | Shader palette | Temperature bias | Notes |
|---------|---------------|-----------------|-------|
| Hero | Neutral blend | Shifts during scroll as intro gesture | Equal cool/warm; slow rotation |
| Projects | Warm dominant | 70% warm / 30% cool | Amber/gold — focus, craft, making |
| About | Cool dominant | 30% warm / 70% cool | Aqua/violet — calm, reflective |
| Contact | Warm returning | 60% warm / 40% cool | Inviting close; echoes the hero's blend |

Palette interpolation is handled by the `u_palette_t` uniform (0.0 = full cool, 1.0 = full warm). The shader lerps between the two palettes in OKLCH.

### Contrast Audit Requirements

Before any text colour token is used, it must be verified against every surface it appears on:

| Token | Surface | Ratio | WCAG level |
|-------|---------|-------|-----------|
| `--text-primary` | `--surface-base` | ≥ 15:1 | AAA |
| `--text-secondary` | `--surface-base` | ≥ 7:1 | AA |
| `--text-tertiary` | `--surface-base` | ≥ 4.5:1 | AA |
| `--text-primary` | `--surface-raised` | ≥ 12:1 | AAA |
| `--text-secondary` | `--surface-raised` | ≥ 6:1 | AA |

The shader canvas is never a text background. Text is **always** on a surface token.

---

## 3. Shader State Model

### Architecture

```
DOM (semantic, accessible, content-bearing)
  └─ sits above
     WebGL Canvas (aria-hidden="true", decorative, pointer-events: none for content areas)
       └─ fragment shader: fluid simulation + colour field
```

The canvas is `position: fixed; inset: 0; z-index: 0`. All content sits at `z-index: 1` or above on their own stacking context with a semi-transparent or opaque surface background.

### Uniforms

```glsl
uniform float u_time;           // seconds since load
uniform vec2  u_resolution;     // canvas size in px
uniform vec2  u_pointer;        // normalised pointer position (0–1)
uniform float u_pointer_active; // 0 or 1 — is pointer being held?
uniform float u_scroll;         // normalised scroll progress (0–1)
uniform float u_palette_t;      // 0=full cool, 1=full warm
uniform float u_flow_speed;     // scalar on simulation velocity
uniform float u_density;        // cloud/fluid density (opacity feel)
uniform float u_disturbance;    // pointer disturbance radius
uniform vec2  u_trace[32];      // mark-making: ring buffer of recent pointer positions
uniform float u_trace_age[32];  // age of each trace point (0–1, 1=just placed, 0=dissolved)
```

### Per-Section Shader Parameters

```typescript
type ShaderState = {
  palette_t:   number;  // 0.0–1.0
  flow_speed:  number;  // 0.1–1.0
  density:     number;  // 0.2–1.0
  disturbance: number;  // 0.1–1.0
};

const SECTION_STATES: Record<string, ShaderState> = {
  hero: {
    palette_t:   0.5,   // neutral blend
    flow_speed:  0.4,   // slow, meditative
    density:     0.6,
    disturbance: 0.8,   // high pointer reactivity on the hero
  },
  projects: {
    palette_t:   0.75,  // warm dominant
    flow_speed:  0.25,  // slower — focused, content foreground
    density:     0.4,   // thinner — don't compete with project cards
    disturbance: 0.5,
  },
  about: {
    palette_t:   0.25,  // cool dominant
    flow_speed:  0.35,
    density:     0.5,
    disturbance: 0.4,
  },
  contact: {
    palette_t:   0.6,   // warm returning
    flow_speed:  0.5,   // slightly faster — inviting
    density:     0.65,
    disturbance: 0.7,
  },
};
```

### Transition Model

- Section tracking via `IntersectionObserver` with `rootMargin: '-40% 0px -40% 0px'` — the active section is the one occupying the middle 20% of the viewport
- On section change: all uniforms interpolate toward their target values over **1200ms** using an ease-out curve (cubic `t³`)
- Interpolation runs inside the `rAF` loop — no separate animation library needed
- Pre-transition begins when a section enters the `rootMargin` boundary, so the shift is mostly complete by the time it reaches centre

### Fluid Simulation Approach

**Phase 1 (build start):** Simplex noise field — two or three octaves, advected by a slow velocity field derived from the noise gradient. Visually convincing, cheap, easy to parameterise. Sufficient to validate the aesthetic.

**Phase 2 (polish):** Upgrade to a ping-pong framebuffer Navier-Stokes solver if the noise field doesn't achieve the right organic feel. This is the full fluid sim approach used by Active Theory et al. It adds proper divergence-free flow and more realistic disturbance propagation from the pointer.

The simplex path is the safe default. Navier-Stokes is opt-in during polish.

### Pointer Mark-Making

One bounded interaction: holding and dragging the pointer leaves a persistent ink trace that dissolves over ~4 seconds.

- Pointer positions are written into `u_trace` as a ring buffer (newest overwrites oldest)
- `u_trace_age` counts up from 0.0 (just placed) to 1.0 (fully dissolved), driven by `u_time`
- The fragment shader reads each trace point and adds a Gaussian splat of colour + velocity disturbance, fading with age
- Dissolution curve: `smoothstep(0.6, 1.0, age)` — sharp presence then a graceful fade
- Maximum 32 simultaneous trace points — beyond that, the oldest is evicted

### `prefers-reduced-motion` Fallback

When `prefers-reduced-motion: reduce` is set:

- The `rAF` loop does **not** run
- The canvas renders a single frame: a static gradient using the current section's cool/warm blend, authored to look as beautiful as the animated version
- The MotionToggle button is initialised to "paused" state
- No animation plays unless the user explicitly toggles it on

The static gradient is a first-class experience — it should be designed and tested independently, not treated as a degraded fallback.

### Performance Budget

| Target | Threshold |
|--------|-----------|
| Frame time | ≤ 16ms (60fps) desktop |
| Frame time — mobile | ≤ 33ms (30fps) acceptable |
| Canvas resolution | 1.0× device pixel ratio desktop; 0.5× mobile (upscaled via CSS) |
| Pause when off-screen | `IntersectionObserver` on canvas; stop `rAF` when canvas not visible |
| First paint | Canvas initialises after first `rAF`, never blocks content paint |

---

## 4. Spatial & Layout System

### Parallax Layers

Three depth layers create perceived Z-space without Three.js:

| Layer | Content | Scroll rate | CSS |
|-------|---------|-------------|-----|
| 0 (deepest) | WebGL canvas | Fixed (CSS `position: fixed`) | — |
| 1 | Section background tints, decorative shapes | 0.92× natural scroll | `transform: translateY(calc(var(--scroll-offset) * 0.08))` |
| 2 | Main content blocks | 1.0× (natural) | — |
| 3 | Accent labels, floating tags | 1.06× | `transform: translateY(calc(var(--scroll-offset) * -0.06))` |

`--scroll-offset` is a CSS custom property updated on scroll via a JS listener (throttled to `rAF`). This is gated behind `prefers-reduced-motion`.

### Grid

```css
--grid-columns:    12;
--grid-gap:        clamp(1rem, 2vw, 1.5rem);
--grid-max-width:  1400px;
--grid-margin:     clamp(1.5rem, 5vw, 4rem);
```

Content uses CSS Grid. Sections span the full viewport height minimum (`min-height: 100svh`).

### Spacing Scale

```css
--space-1:   0.25rem;
--space-2:   0.5rem;
--space-3:   0.75rem;
--space-4:   1rem;
--space-6:   1.5rem;
--space-8:   2rem;
--space-12:  3rem;
--space-16:  4rem;
--space-24:  6rem;
--space-32:  8rem;

/* Section vertical rhythm */
--section-padding-y: clamp(4rem, 8vw, 10rem);
```

---

## 5. Component Inventory

| Component | File | Purpose |
|-----------|------|---------|
| `ShaderCanvas` | `lib/shader/ShaderCanvas.svelte` | WebGL canvas, `aria-hidden`, manages GL context |
| `ShaderController` | `lib/shader/ShaderController.svelte` | Section tracking, uniform interpolation, `rAF` loop |
| `MotionToggle` | `lib/a11y/MotionToggle.svelte` | Pause/resume button, persisted to `localStorage` |
| `SkipLink` | `lib/a11y/SkipLink.svelte` | Skip to main content; visually hidden until focused |
| `NavBar` | `lib/nav/NavBar.svelte` | Sticky top nav, section anchor links, keyboard navigable |
| `HeroSection` | `lib/sections/HeroSection.svelte` | Display headline, sub-copy, scroll indicator |
| `ProjectsSection` | `lib/sections/ProjectsSection.svelte` | Project grid layout wrapper |
| `ProjectCard` | `lib/projects/ProjectCard.svelte` | Dual-mode card — collapsed (scannable) + expanded (deep) |
| `AboutSection` | `lib/sections/AboutSection.svelte` | Bio, skills, professional context |
| `ContactSection` | `lib/sections/ContactSection.svelte` | Links, email, GitHub |
| `SectionTracker` | `lib/sections/SectionTracker.svelte` | `IntersectionObserver` wrapper; emits active section |

---

## 6. Accessibility Checklist (pre-ship)

- [ ] All interactive elements reachable and operable by keyboard alone
- [ ] Focus order matches visual/DOM reading order
- [ ] Focus ring visible in all states (using `--focus-ring`)
- [ ] `SkipLink` navigates to `<main id="main-content">`
- [ ] All landmark regions present: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] All images have meaningful `alt` text; decorative images `alt=""`
- [ ] WebGL canvas is `aria-hidden="true"` with no interactive children
- [ ] `ProjectCard` expand/collapse uses `aria-expanded` + `aria-controls`
- [ ] Contrast ≥ 4.5:1 for all body text at all font weights
- [ ] Contrast ≥ 3:1 for all large text (≥18pt / 14pt bold)
- [ ] `prefers-reduced-motion` static fallback is tested as a standalone experience
- [ ] `MotionToggle` state persisted to `localStorage`; re-read on mount
- [ ] 200% zoom: no horizontal scroll on content, no truncated text
- [ ] 400% reflow: content linearises to single column, nothing overlaps
- [ ] Tested with NVDA + Chrome on Windows

---

## 7. Phased Build Plan

### Phase 1 — Foundation (days 1–2)

Goal: a running SvelteKit app with the full design token layer, correct HTML structure, and static content.

- [x] Install Fraunces and Inter via `@fontsource-variable`
- [x] Create `src/lib/styles/tokens.css` — all CSS custom properties (type scale, colour tokens, spacing, grid)
- [x] Create `src/lib/styles/reset.css` — accessible base reset (box-sizing, focus styles, reduced-motion baseline)
- [x] Create `src/lib/styles/global.css` — typography base, body background
- [x] Import styles into `+layout.svelte`
- [x] Implement `SkipLink` and `MotionToggle` in layout
- [x] Scaffold all four sections as semantic HTML placeholders: `HeroSection`, `ProjectsSection`, `AboutSection`, `ContactSection`
- [x] Implement `NavBar` with section anchor links and keyboard navigation
- [x] Static content written into all sections (real copy, not lorem ipsum)
- [ ] Responsive grid applied; 400% reflow passes

**Exit criterion:** accessible, typographically correct static site running on `localhost`. Passes axe-core automated audit.

---

### Phase 2 — Shader Core (days 3–5)

Goal: the fluid field exists, runs, and respects motion preferences.

- [ ] `ShaderCanvas` component: WebGL context init, vertex shader (full-screen quad), fragment shader stub
- [ ] Simplex noise GLSL implementation (or import from a permissively licensed source)
- [ ] Basic fluid field: noise-advected velocity + colour field, two octaves
- [ ] `rAF` loop with FPS budget (skip frame if behind)
- [ ] Resolution scaling: 1.0× desktop, 0.5× mobile (detect via `matchMedia`)
- [ ] `IntersectionObserver` on canvas: pause `rAF` when not visible
- [ ] `prefers-reduced-motion` detection: render static gradient, skip `rAF` entirely
- [ ] `MotionToggle` wired to `rAF` start/stop

**Exit criterion:** animated fluid field on desktop, static gradient on reduced-motion. No layout shift. No console errors.

---

### Phase 3 — Section-Reactive Shader (days 6–7)

Goal: the shader responds to which section the visitor is in.

- [ ] `SectionTracker` component using `IntersectionObserver` with `-40% 0px -40% 0px` rootMargin
- [ ] `ShaderController` receives active section ID, looks up `SECTION_STATES`
- [ ] Uniform interpolation in `rAF` loop (ease-out cubic, 1200ms)
- [ ] `u_palette_t`, `u_flow_speed`, `u_density`, `u_disturbance` all wired and responding
- [ ] Palette interpolation working correctly across cool↔warm in OKLCH

**Exit criterion:** visible, smooth palette and flow shifts as you scroll through all four sections.

---

### Phase 4 — Content & Typography (days 8–10)

Goal: all content sections built out with final copy and full typographic system.

- [ ] `HeroSection`: display headline (Fraunces 800), sub-copy, scroll indicator
- [ ] `ProjectCard`: collapsed state (screenshot, title, one-line hook, tech stack badges, links) + expanded state (narrative text, technical detail)
- [ ] Project content: db-documenter and blog cards written and expanded
- [ ] Expand/collapse animation on `ProjectCard` (height transition, `aria-expanded`)
- [ ] `AboutSection`: bio, skills, professional context
- [ ] `ContactSection`: email link, GitHub, any other links

**Exit criterion:** full portfolio readable and usable with no shader running. Screen-reader walkthrough passes.

---

### Phase 5 — Pointer Interaction (day 11)

Goal: the mark-making interaction is implemented.

- [ ] Pointer event listeners on the canvas (or document)
- [ ] Ring buffer of trace positions written to `u_trace` / `u_trace_age` uniforms
- [ ] Fragment shader: Gaussian splat at each trace point, faded by age
- [ ] Dissolution curve: `smoothstep(0.6, 1.0, age)` — presence then graceful fade
- [ ] Tested: feels tactile but not gimmicky; one interaction, done well

**Exit criterion:** pointer leaves a visible ink trace that dissolves naturally over ~4 seconds.

---

### Phase 6 — Parallax & Spatial Depth (day 12)

Goal: layered depth creates sense of place.

- [ ] `--scroll-offset` CSS property updated on scroll (throttled to `rAF`)
- [ ] Layer 1 and Layer 3 parallax applied (section backgrounds, accent labels)
- [ ] Subtle Z-axis motion on content blocks on hover (optional, gated on `no-preference`)
- [ ] Tested: adds depth without causing motion sickness

**Exit criterion:** scrolling feels three-dimensional without distracting from content.

---

### Phase 7 — Accessibility Audit (days 13–14)

Goal: WCAG 2.2 AA confirmed across the board.

- [ ] Run axe-core; resolve all violations
- [ ] Manual keyboard navigation walkthrough (Tab, Shift+Tab, Enter, Space, Escape for card expand)
- [ ] NVDA + Chrome screen reader test
- [ ] Contrast audit using browser DevTools APCA or WebAIM contrast checker
- [ ] 200% zoom test
- [ ] 400% reflow test (viewport set to 320px)
- [ ] `prefers-reduced-motion` test (static gradient confirmed as first-class experience)

**Exit criterion:** zero axe-core violations; all manual checks pass.

---

### Phase 8 — Performance & Deployment (day 15)

Goal: shipped to Cloudflare Pages, fast.

- [ ] Lighthouse audit: target 90+ Performance, 100 Accessibility
- [ ] Font loading: `font-display: swap`; preload critical weights
- [ ] Shader: verify 60fps desktop, acceptable 30fps mobile
- [ ] Install `@sveltejs/adapter-cloudflare` and configure `svelte.config.js`
- [ ] Set up Cloudflare Pages project pointing at GitHub repo
- [ ] Configure custom domain in Cloudflare Pages DNS
- [ ] Verify production build: static assets, no SSR-only APIs used

**Exit criterion:** site live at custom domain, Lighthouse 90+ Performance, 100 Accessibility.

---

## 8. Open Decisions (to resolve during build)

- [ ] **Fluid sim upgrade path** — confirm whether simplex noise field is visually sufficient or whether Navier-Stokes ping-pong framebuffers are needed (evaluate end of Phase 2)
- [ ] **Variable font axis animation** — confirm whether Fraunces weight morphing between sections is used (nice-to-have; adds richness if not distracting)
- [ ] **Project card screenshot/media** — what assets exist for db-documenter (no UI; will use generated ER diagram as hero image) and blog (live site screenshot)
- [ ] **Contact form** — links only, or a functional contact form? (Cloudflare Pages supports form submissions via Workers)

---

*All decisions above are confirmed unless marked as open. Implementation starts at Phase 1.*
