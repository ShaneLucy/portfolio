# Portfolio Creative Direction: Liquid Light

*Session date: 2026-06-06 — to be refined in a subsequent session*

---

## Context & Goals

**Owner:** Senior full-stack software engineer, backend-heavy by professional experience.

**Portfolio purpose:** Prove exceptional front-end and design capability — the resume already covers backend. The target audience includes recruiters, hiring managers, and senior designers / creative directors. The portfolio must make a creative director stop and ask "who built this?" — not "neat CSS trick."

**The bar:** The previous portfolio recreated a minimal Ubuntu desktop environment in the browser. This must clear that bar but be entirely different.

**Hard constraints:**
- WCAG 2.2 AA accessibility — non-negotiable, not caveated
- Must showcase taste and design sensibility, not just technical ability
- 3D or shader-based (user requirement going into final decision)

---

## Concepts Considered & Discarded

The following were explored and set aside:

- **3D Home Office** (original idea) — Three.js, first-person POV from desk chair, monitors as content panels. Critique: genre is saturated; free-look navigation kills discoverability for time-poor recruiters; requires a full parallel accessible DOM site (two portfolios of effort); reads as "engineer doing 3D" rather than design craft.
- **Letterform** — editorial magazine / living type specimen. Strong design signal but no 3D/shader element.
- **The Cut** — scroll-driven cinematic motion design. Strong motion-design signal but no 3D/shader element.
- **Atelier** — generative-design studio where the visitor co-creates the site's visual identity. Interesting systems signal but no 3D/shader element.
- **Reactive** — micro-interaction playground. No 3D/shader element.
- **Risograph Engine** — real-time riso-print shader post-process. Highest taste/rarity signal, cleanest accessibility, but user gravitated toward fluid/light aesthetic.
- **Depth of Field** — first-person photographic 3D with authored camera shots and real bokeh. Closest to the 3D Office idea; re-incurs the parallel-accessible-build cost.
- **Loom** — real-time GPU cloth simulation. Warm and rare; hardest to make look expensive.
- **Camera Obscura** — refraction/caustics/dispersion shader; reveal-by-light dark UI. Strong optical flex but "dark + glass + glow" aesthetic is currently saturated (glassmorphism fatigue).

---

## Chosen Direction: Liquid Light

### The Experience

The visitor lands in a dark, calm space occupied by a single slow-moving field of light — think backlit ink in water, or aurora behaving like liquid. It responds to the pointer (pushing/disturbing the fluid), and scrolling shifts its temperature and palette. As sections change, the field recomposes itself into the backdrop for that content. The restraint is the flex: one gorgeous, custom, performant visual system carried with total confidence, rather than a wall of effects.

### Why This Concept

- The wow factor and the content are not in tension — the shader frames and responds to content rather than hiding it
- Reads immediately as front-end and design craft: shader artistry, colour science, motion restraint, typographic confidence
- Accessible by construction (see below) — no parallel site required
- Rare in the portfolio space; not a saturated genre
- Confirmed visual reference: **Active Theory** (activetheory.net) — a Los Angeles creative studio whose WebGL/real-time 3D work is the closest public reference for this aesthetic

### Core Technical Approach

- **Framework:** SvelteKit
- **Rendering:** WebGL — a `<canvas aria-hidden="true">` decorative layer behind the real DOM; the canvas is never load-bearing for content
- **Shader approach:** Custom GLSL fragment shaders; fluid simulation (Navier-Stokes or simplex noise field), real-time reactive to scroll position and pointer
- **Colour:** OKLCH colour space for perceptually smooth, accurate gradients (not muddy RGB lerps)
- **Animation loop:** `requestAnimationFrame` with FPS budgeting; `IntersectionObserver` to pause the shader when off-screen

### Three Key Refinements (proposed in session)

1. **Content-reactive shader state** — the palette, density, and flow of the fluid shift per content section and settle around focused elements. The shader is not ambient wallpaper; it actively responds to what the visitor is reading. This is what makes it feel *designed*, not looping.

2. **Severe editorial typography as the co-star** — an expressive display face, tight modular type scale, strict grid discipline. The shader does the emotional/atmospheric work; the typography does the intellectual/structural work. Together they signal a complete design sensibility. Neither works alone.

3. **One bounded mark-making interaction** — a single moment where the visitor's pointer leaves a lasting trace in the fluid (a stroke, a ripple that persists briefly before dissolving). Makes the piece tactile and personal without gimmick. One interaction, done perfectly, is more impressive than five mediocre ones.

### Spatial Depth Variant

Rather than full 3D, the recommended execution adds **layered parallax and subtle Z-axis motion** to create perceived depth and a sense of place — evoking spatial presence without the performance and accessibility costs of Three.js. This is the hybrid that *adds* to Liquid Light rather than diluting it.

### Accessibility Strategy

This is the primary reason Liquid Light was recommended over 3D alternatives:

- The canonical site is a **fully semantic, accessible DOM** — real text, real headings, real landmarks, full keyboard navigation, correct reading order
- The WebGL canvas is `aria-hidden="true"` and sits behind the content layer; removing it entirely leaves a fully functional site
- Text is **never rendered on the shader** — it always sits on a guaranteed-contrast surface so contrast cannot drift below 4.5:1 regardless of shader state
- `prefers-reduced-motion`: the live fluid field is replaced with a **single static rendered gradient** (still beautiful; zero motion). This is designed as a first-class experience, not a fallback.
- A visible "pause motion" toggle, persisted across sessions
- All font sizes in relative units (`rem`/`clamp()`); survives 200% zoom and 400% reflow (WCAG 1.4.4, 1.4.10)
- Variable-font axis animation (if used for typography) is gated behind `prefers-reduced-motion`
- Contrast checked at every font weight if a variable font is used (thin weights are a common AA failure)

---

## Visual References

- **Active Theory** — activetheory.net — primary reference; creative studio, WebGL/real-time fluid and light as design material
- **Robert Hodgin (flight404)** — generative artist; canonical reference for light-as-fluid simulations
- **akella / Yuri Artiukh** — creative coder; WebGL portfolio experiments closest to this brief
- **bgstaal** — creative coder; fluid/shader aesthetic
- **David Li** — particle and fluid simulations, high craft
- **Patricio Gonzalez Vivo (Book of Shaders)** — foundational GLSL reference; his own work is a good aesthetic benchmark
- **Awwwards WebGL category** — living archive of current-state-of-the-art WebGL portfolio work
- **Codrops Playground** — living reference for creative front-end experiments

---

## Open Questions for Next Session

The following should be resolved before implementation begins:

- [ ] **Display typeface selection** — which expressive display face pairs with the fluid aesthetic? (serif with optical personality vs. contemporary grotesque vs. variable face with extreme weight range)
- [ ] **Colour palette direction** — warm (amber/gold/deep orange — fire, bioluminescence) vs. cool (aqua/violet/deep blue — deep water, aurora) vs. shifting (palette rotates per section)
- [ ] **Content sections** — what pages/sections does the portfolio need? (e.g. hero/intro, about, projects, contact — and are there any non-standard sections?)
- [ ] **Project content** — which projects will be featured, and is there a preferred format for case studies?
- [ ] **Domain and deployment target** — already decided or still open?
- [ ] **Full creative system** — type scale, section-reactive shader state model, AA-safe contrast token set, phased build plan — to be developed once above questions are answered

---

*Document created from the creative brainstorm session on 2026-06-06. All decisions above reflect the conversation; nothing has been implemented yet.*
