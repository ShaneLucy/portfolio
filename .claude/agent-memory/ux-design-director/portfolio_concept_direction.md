---
name: portfolio-concept-direction
description: Creative concepts explored for the portfolio. Backend-themed concepts DROPPED; pivoted to front-end/design-craft concepts
metadata:
  type: project
---

Open creative brainstorm for a new portfolio. See [[user-profile]].

**PIVOT (2026-06-06):** User rejected all backend-themed concepts. The portfolio must showcase FRONT-END + DESIGN mastery, not systems thinking. Dropped: Trace, Compile, The Incident, Playable Architecture (all skew backend). The earlier recommendation of "Trace" is void.

**User's original idea (also not chosen):** A 3D home office (Three.js), first-person camera, monitors as content. Critique stands: discoverability/perf/a11y costs, crowded genre.

**New front-end/design-craft concepts generated (2026-06-06):**

- **Letterform** — portfolio as a living type specimen / editorial magazine; typography craft is the hero.
- **Liquid Light** — WebGL shader-driven generative-art site; a tactile fluid/light field reacts to the visitor; motion + shader craft.
- **The Cut** — motion-design "film" portfolio built on a scroll-driven timeline; cinematic sequencing, FLIP transitions, choreography.
- **Atelier** — generative-design studio where the visitor co-creates the site's identity (params drive a live generative system); systems-design thinking applied to visuals.
- **Reactive** — interaction-design playground; every element is a tiny demonstrably-delightful interaction; micro-interaction + state craft.

**NARROWED (2026-06-06):** Down to two finalists — **Liquid Light** and the **original 3D home office** (Three.js, first-person POV, monitors as content panels). Letterform, The Cut, Atelier, Reactive set aside.

**My recommendation (2026-06-06):** Build **Liquid Light** with **spatial depth/parallax (no full 3D)** + three refinements: (1) content-reactive shader state — palette/density/flow shift per section and settle around focused elements; (2) severe editorial typography as the taste signal (expressive display face, tight modular scale, grid discipline); (3) one bounded mark-making interaction. Rationale: target audience includes CDs/senior designers and the goal is to read as TASTE, not engineering. 3D office sends the "engineer doing 3D" signal we're escaping, is a saturated genre, fails the 2-min recruiter test on discoverability, and only passes the hard a11y gate by building a second parallel site. Liquid Light is a11y-compliant by construction (real DOM + reduced-motion static-gradient fallback).

**Hybrid verdict:** Liquid-aesthetics-on-3D = dilutes (inherits all 3D costs). Liquid-Light-with-spatial-depth = adds (cheap "sense of place"); it's just the strong execution of Liquid Light. If 3D office is ever wanted, do it as authored camera "shots" (no free-look) + 3D as progressive enhancement over a canonical accessible site + baked/stylized low-poly art direction.

**MORE OPTIONS REQUESTED (2026-06-06):** User narrowed to two finalists — **Liquid Light** and **3D Home Office** — but wants more options before committing. Firm constraint: new concepts MUST use 3D and/or shaders, matching the finalists' technical ambition. Generated 4 more (all 3D/shader):

- **Risograph Engine** — real-time riso-print skin (halftone/registration/ink-bleed) as shader post-process over DOM. Print-craft taste signal; safest on a11y; shader-skin not spatial. MY SLEEPER RECOMMENDATION (rarest pure-taste signal, cleanest a11y).
- **Depth of Field** — first-person _photographic_ portfolio; authored camera shots + real DOF/bokeh/rack-focus (Three.js EffectComposer). Cinematographic/directorial flex. Closest to 3D Office; re-incurs parallel-accessible-build cost. The "authored shots" fix is how to make 3D Office read as design not engineering.
- **Loom** — real-time GPU cloth sim (GPGPU mass-spring) with woven generative patterns; textile/fashion register. Closest sibling to Liquid Light (tactile-material), warmer/rarer; hardest to make look expensive (rubbery-cloth risk).
- **Camera Obscura** — shader refraction/dispersion/caustics; reveal-by-light dark UI. Optical "design physics" flex; "dark+glass+glow" is the most saturated aesthetic — execution must beat the glassmorphism crowd.

Pattern across the shader-skin concepts (Riso, Camera Obscura): a11y-safe by construction because the shader is a decorative skin over a real semantic DOM; text NEVER lives on the shader layer; reduced-motion freezes to a static frame.

**Liquid Light visual references given to user:** Active Theory (studio), Robert Hodgin/flight404, akella (Yuri Artiukh) + bgstaal, David Li, Patricio Gonzalez Vivo (Book of Shaders). Plus Awwwards WebGL + Codrops Playground as ongoing reference.

**Status:** Awaiting user's final pick — now from a set of 6 (Liquid Light, 3D Office, Risograph Engine, Depth of Field, Loom, Camera Obscura). Next step on pick: full creative system — type scale + display face, section-reactive shader state model, AA-safe text-over-canvas color/contrast tokens, phased build plan with reduced-motion fallback designed in from line one.

How to apply: When the user picks a direction, develop the full creative system and record the resulting design tokens/IA decisions as new memories. Do NOT reintroduce backend metaphors.
