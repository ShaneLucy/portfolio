# Portfolio Creative Direction: Pop-up Book

_Revised 2026-11-26. Replaces "Liquid Light" (June 2026), which is still in git history._

---

## Context & Goals

**Owner:** Senior full-stack software engineer, backend-heavy by professional experience.

**Purpose:** Prove front-end and design craft. The CV already covers backend. The audience is recruiters, hiring managers, senior designers and creative directors. The bar hasn't changed: a creative director should stop and ask "who built this?", not "neat trick."

**Hard constraints:**

- WCAG 2.2 AA. Non-negotiable.
- Artistic, and genuinely 3D.
- Taste first, technique second. The 3D has to look like design work, not a tech demo.

**How we got here.** The first portfolio recreated an Ubuntu desktop in the browser. In June 2026 the pivot was "Liquid Light", a fullscreen fluid shader behind the content. Most of it got built, but the result looked like a familiar noise gradient rather than something authored. It wasn't 3D, and the content sat on frosted-glass panels, a look we'd already called saturated. It was reviewed and replaced on 2026-11-26.

**A correction to the June reasoning.** 3D was given up for accessibility, but that argument applied to a walkable 3D office where the content lived inside the scene. A decorative 3D canvas behind the real DOM is exactly as accessible as a 2D shader. What 3D really costs is performance, bundle size and the time to make assets.

---

## The Concept

The portfolio is a paper pop-up book, and each project is a place.

### The Experience

The visitor lands on a closed book lying under a lamp: white card, a cut-paper title, one colour. Scrolling opens it. Each spread is a project, and each project is a small place that rises out of the fold as the page opens, then folds flat again as you move on. After the projects comes the colophon (About), then the back cover (Contact).

The book is the atmosphere and the metaphor. Everything you read is real HTML beside it.

### Moving Through the Book

- **The pages turn and the camera stays still.** The book sits in a fixed three-quarter view. Scrolling turns each page, so one pop-up folds flat as the next one rises. The camera never travels, which keeps the motion on-axis and easy on people with motion sensitivity.
- **Text sits beside the book.** On desktop it's a text column next to a sticky book. On phones the book stacks above the text. That leaves the whole spread for the pop-up, and the text reflows at 400% zoom without fighting the 3D.

### Structure

| Section       | In the book            | Place                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero          | Cover                  | The name as cut-paper letterforms rising off the cover. The real `h1` stays in the HTML.                                                                                                                                                                                |
| db-documenter | Spread                 | A map room: a cartographer's table where a paper map rises into a small town, with database tables as buildings and relationships as roads. The library literally draws maps of databases.                                                                              |
| Travel Blog   | Spread                 | A tunnel-book horizon. Each trip is one layer of a deep stacked scene, seen through the open page: harbour walls up front, then rooftops and towers, with Norway's mountains at the back. Mostly skyline and landscape bands, so it doesn't repeat the map room's town. |
| solar-system  | Spread (if it's ready) | A paper orrery: nested rings that swing up as the page opens                                                                                                                                                                                                            |
| About         | Colophon               | The maker's workbench: cutting mat, scalpel, steel ruler, offcuts                                                                                                                                                                                                       |
| Contact       | Back cover             | An envelope that pops open into a letter                                                                                                                                                                                                                                |

- **solar-system is conditional.** It's in only if it's ready in time. Its spread gets built last, and the book has to work with either two or three project spreads.
- **Pretty Good Playground is out**, by choice.
- **The travel spread grows with the blog.** The trips so far are Norway, Barcelona, Tossa de Mar, Munich and Rethymno. A new trip adds a layer instead of a new scene. It'll get muddy past about six layers, so when that happens, layers get merged or retired.
- **Adding work later is costly.** Every new project means a new spread to design and build, not just a new card. That's the ongoing price of project-as-place.

### The Look

- **White card**, cut and folded in the spirit of origamic architecture. Light and shadow do the work.
- **One accent stock per spread.** The accent carries the colour change from section to section, replacing Liquid Light's cool/warm palette.
- **Real paper qualities:** visible fibre, slightly soft edges, visible card thickness at the cuts, a hint of light coming through thin card.
- **Lighting is the whole look.** One warm key light with soft real-time shadows. Nothing is baked: pieces move as they fold, so baked shadows would be wrong mid-fold.
- **No illustration.** Every shape has to read from its silhouette alone. That's the design discipline this direction demands, and it's what keeps it editorial rather than a children's book.

### The One Interaction

The pointer moves the lamp. Shadows swing across the spread as if you're tilting the book under a light. It's contained and tactile, and it shows off the one thing this look depends on. On touch screens the lamp drifts slowly by itself. With reduced motion or the motion toggle off, the lamp stays still. This replaces Liquid Light's pointer trace.

---

## Technical Approach

This is an outline. The full plan comes out of the tech-lead planning step.

- **Rendering:** Three.js, as in `solar-system`. A `<canvas aria-hidden="true">` behind the DOM that's never needed for content, the same contract as today.
- **Geometry, mostly in code:** cut shapes are defined as 2D paths (SVG), extruded to card thickness and parented on hinges. Each spread is driven by a single `open` value from 0 to 1, scrubbed by scroll.
- **Pop-up mechanics:** parallel folds (box-like pieces, and the travel spread's layers) are simple kinematics. V-folds need their angles solved from the page angle. This is the hardest part to make convincing, so it gets prototyped first.
- **Blender, via the Blender Lab MCP add-on:** for blocking out spreads from reference images and for the odd non-flat hero piece. The add-on is installed in Blender 5.2 but isn't connected to Claude Code yet.
- **Shadows:** soft real-time shadow maps, at lower resolution on mobile.
- **Loading:** first paint shows a pre-rendered still of the cover, and Three.js and the scene load after it. Rendering pauses when the canvas is off-screen or the tab is hidden. Device pixel ratio is capped.

### Kept From the Current Build

Semantic sections, section nav and tracker, the motion store and toggle, the skip link, the a11y fixes and the tests. Fraunces suits a book well. Whether to keep it with Inter or revise the type is still open.

### Replaced

`ShaderCanvas` (the noise shader), the CSS parallax, the frosted-glass surfaces and the cool/warm palette tokens. `DESIGN_SYSTEM.md` still describes Liquid Light. It'll be rewritten once the visual system is worked out.

---

## Accessibility

The same principles as before, all still in force:

- **The DOM is canonical:** real headings, landmarks, reading order and keyboard navigation. Remove the canvas and the site still works.
- **Text is never rendered in the canvas or straight onto lit paper.** It always sits on a surface token with guaranteed contrast, so a passing shadow can never drop it below 4.5:1.
- **`prefers-reduced-motion` and the motion toggle:** each spread is shown fully open as a still, with no page turns and no camera moves. That's a first-class version, not a fallback.
- **No WebGL:** the same pre-rendered stills.
- **No large camera swoops.** Page turns stay on-axis to avoid vestibular triggers.
- **Relative font sizes throughout.** The site survives 200% zoom and 400% reflow.

---

## Risks

- **Pop-up mechanics can look fake.** Pieces that clip or move wrongly break the illusion straight away. Prototype one V-fold early.
- **White on white can go flat.** With weak lighting the whole thing looks like an untextured model, so lighting gets tuned before anything else.
- **Twee.** Paper and pop-ups can tip into children's-book territory. Restraint in the accents and the typography keeps it editorial.
- **Stalling.** There's no deadline, the book launches all at once (decided), and the last attempt sat untouched from July to November. Nothing goes live until the whole book is done, so keep the build moving spread by spread.
- **The solar-system dependency.** Its spread is built last, and the book is designed to stand without it.

---

## References

- **Robert Sabuda and Matthew Reinhart:** pop-up engineering at its best
- **Masahiro Chatani:** origamic architecture, buildings cut and folded from single sheets of white card
- **David A. Carter, _White Noise_:** an all-white pop-up book, proof that white card alone can carry it

---

## Open Questions

Decided on 2026-11-26: the place for each spread, the scroll model, the text layout, the pointer interaction, and launching all at once.

- [ ] Accent colour for each spread
- [ ] Typography: keep Fraunces and Inter, or revise for the book
- [ ] Which silhouette each trip contributes to the travel spread's layers, and in what order
- [ ] Technical plan (raw Three.js vs Threlte, geometry pipeline, shadow technique, deployment), for the tech-lead planning step. The deploy workflow currently targets the blog's Cloudflare Pages project.
- [ ] Connect the Blender MCP add-on to Claude Code
