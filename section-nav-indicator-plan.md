# Section Navigation Indicator — Implementation Plan

Planned: 2026-07-01

---

## Overview

A supplementary navigation component for the one-page portfolio. Displays as a vertical rail on the right side of the viewport on desktop, and a horizontal strip below the fixed nav bar on mobile. Tracks the active section reactively, allows click-to-navigate, and supports prev/next traversal. Hidden on the hero section; revealed once the user scrolls into Projects.

---

## Architecture Decisions

### State — read `shaderStore` directly

The indicator reads `shaderStore.activeSection` via `$derived`. No second observer, no second store, no event bus. `SectionTracker` remains the sole writer; the indicator is a pure reader.

### Scroll-to — native anchors + `location.hash`

Section items are real `<a href="#id">` links, identical to `NavBar`. Prev/Next buttons set `location.hash`. The existing `reset.css` already owns smooth-scroll and the `prefers-reduced-motion` downgrade — no JS duplication needed.

> **Pre-existing bug to fix:** There is no `scroll-padding-top` on the scroll root, so hash jumps currently land under the fixed nav bar. Add `scroll-padding-top` (4rem desktop / strip height narrow) to `reset.css` or `global.css` when wiring the indicator.

### Component split — 3 files + config

```
src/lib/nav/
  sections.config.ts          # SECTION_ORDER [{id, label}] — single source of truth
  SectionNavIndicator.svelte  # orchestrator, <nav> landmark, responsive container
  SectionNavItem.svelte       # one presentational <a aria-current>
  SectionNavControls.svelte   # prev/next <button>s, disabled at ends
```

**Existing files to update:**

| File                                       | Change                                           |
| ------------------------------------------ | ------------------------------------------------ |
| `src/routes/+layout.svelte`                | Add `<SectionNavIndicator />` after `<NavBar />` |
| `src/lib/sections/SectionTracker.svelte`   | Source `SECTION_IDS` from `SECTION_ORDER`        |
| `src/lib/styles/reset.css` or `global.css` | Add `scroll-padding-top`                         |
| `src/lib/styles/tokens.css`                | Add three-state nav colour tokens                |

### Responsive — CSS-only, one rendered instance

One DOM subtree. No `{#if}`, no `matchMedia` for layout. The component swaps from vertical rail to horizontal strip at `1100px` via `flex-direction` in CSS. Avoids duplicate `nav` landmarks and mount churn on resize.

### Placement in layout — after `<NavBar>`, `z-index: 40`

```
<ShaderCanvas />
<SectionTracker />
<ParallaxController />
<SkipLink />
<NavBar />
<SectionNavIndicator />   ← here
<main>…</main>
<MotionToggle />
```

Tab order: skip-link → main nav → section indicator → content.  
`z-index: 40` — above `<main>`, below the nav's `z-index: 50`.

> **Check at build:** confirm the desktop right-rail width/inset clears `MotionToggle` (bottom-right corner) at the 1100–1280px range.

### Prev/Next logic — derive index from `SECTION_ORDER`

```ts
const currentIndex = $derived(
  Math.max(
    0,
    SECTION_ORDER.findIndex((s) => s.id === shaderStore.activeSection)
  )
);
```

- Prev = `SECTION_ORDER[currentIndex - 1]`, disabled at index 0
- Next = `SECTION_ORDER[currentIndex + 1]`, disabled at last index
- No wrap-around — linear page, linear navigation
- Index self-corrects after scroll: `SectionTracker` updates `shaderStore`, which re-derives `currentIndex`

---

## Visual Design

### Symbol key

```
●  active dot    — cool-bright oklch(72% 0.16 195) + glow
◉  visited dot   — oklch(54% 0.10 195)
○  unvisited dot — oklch(32% 0.04 195)
║  visited segment   — oklch(52% 0.09 195 / 0.75)
│  unvisited segment — oklch(28% 0.03 195 / 0.60)
```

### Desktop vertical rail — active section: Projects

```
        [∧]  ← prev; disabled on hero
         │
  HERO ── ◉  ← visited; label on hover only
         ║
         ║   ← visited segment
         ║
PROJECTS ─ ● ← active; label persistent pill
         │
         │   ← unvisited segment
         │
   ABOUT ─ ○ ← unvisited
         │
 CONTACT ─ ○ ← unvisited
         │
        [∨]  ← next; enabled
```

### Mobile horizontal strip — active section: Projects

```
╔══════════════════════════════════════════════════════════╗
║  [<]   HERO   PROJECTS    ABOUT    CONTACT    [>]        ║
║        ◉════════●──────────○─────────○                   ║
╚══════════════════════════════════════════════════════════╝
```

Track: `position: absolute; height: 1px; bottom: 4px; left: 44px; right: 44px` — does not extend behind Prev/Next buttons.

---

## Colour System

### Three-state tokens (add to `tokens.css`)

| Token                   | Value                        | Usage                             |
| ----------------------- | ---------------------------- | --------------------------------- |
| `--nav-dot-unvisited`   | `oklch(32% 0.04 195)`        | Dots for sections not yet reached |
| `--nav-dot-visited`     | `oklch(54% 0.10 195)`        | Dots for sections passed through  |
| `--nav-dot-active`      | `oklch(72% 0.16 195)`        | Active dot (= `--cool-bright`)    |
| `--nav-track-unvisited` | `oklch(28% 0.03 195 / 0.60)` | Segment before upcoming sections  |
| `--nav-track-visited`   | `oklch(52% 0.09 195 / 0.75)` | Segment between visited sections  |

Single-hue (hue 195 throughout), lightness and chroma only — no warm/cool hue shift between states. Keeps the single-hue Liquid Light identity intact.

> **Accessibility note:** `--nav-dot-unvisited` against the dark background produces ~2.8:1 contrast, slightly below the 3:1 WCAG 2.2 SC 1.4.11 threshold. This is an intentional exception — unvisited dots are future-state indicators, not carriers of essential information. Active-section state is fully accessible via `aria-current="true"` and the live region announcement.

### Dot state matrix

|        | Unvisited                    | Visited                      | Active                                    |
| ------ | ---------------------------- | ---------------------------- | ----------------------------------------- |
| Scale  | 0.6                          | 0.6                          | 1.0                                       |
| Colour | `--nav-dot-unvisited`        | `--nav-dot-visited`          | `--nav-dot-active`                        |
| Glow   | none                         | none                         | `0 0 10px 4px oklch(72% 0.16 195 / 0.45)` |
| Hover  | scale(0.8), colour unchanged | scale(0.8), colour unchanged | already 1.0                               |

Glow is exclusive to the active dot.

---

## Connecting Lines

- **Thickness:** 1px solid — connective tissue, not structural
- **Style:** solid colour, no length-wise gradient (the lightness progression across states already provides the gradient effect)
- **Gap from dots:** 4px clearance from the full-size (`scale(1.0)`) dot edge; at rest (`scale(0.6)`) the gap reads as generous and tightens subtly as a dot becomes active

### Desktop segment construction

Each gap between dots is a container with two child elements:

1. **Background layer** — full segment height, `--nav-track-unvisited`, always visible
2. **Fill layer** — full segment height, `--nav-track-visited`, `transform: scaleY(0)` at rest

### Mobile track construction

Single `position: absolute; height: 1px` element spanning the label area. Dots are 6px circles positioned at `bottom: 1px`, centring them on the 1px track.

---

## Fill Animation

### Mechanism

`transform: scaleY()` on desktop, `transform: scaleX()` on mobile. GPU-composited — never `height`, `width`, `top`, or `left`.

### Direction-aware fill

- **Forward:** `transform-origin: top center` → fill grows top-to-bottom (left-to-right on mobile)
- **Backward:** `transform-origin: bottom center` → fill drains bottom-to-top (right-to-left on mobile)

Set `data-dir="back"` on the fill element synchronously before removing the visited class. The attribute selector switches `transform-origin` before the transition fires.

### Timing

| Element                          | Duration | Easing     |
| -------------------------------- | -------- | ---------- |
| Segment fill (`scaleY`/`scaleX`) | 400ms    | `ease-out` |
| Arriving dot colour              | 250ms    | `ease-out` |
| Arriving dot scale (→ 1.0)       | 250ms    | `ease-out` |
| Departing dot colour (→ visited) | 200ms    | `ease`     |
| Active glow fade-in              | 300ms    | `ease-out` |
| Departing glow fade-out          | 150ms    | `ease-in`  |

Segment fill runs 150ms longer than the dot transition — the dot arrives at full brightness while the connecting line is still completing. Light flows in _after_ the dot lands, consistent with the Liquid Light concept.

### Reduced motion

The existing global `transition-duration: 0.01ms !important` rule in `reset.css` collapses all transitions to instant. State classes and data-attributes still toggle; no component-specific override is needed.

---

## Hero Section — Show/Hide Behaviour

### Decision

The indicator is **hidden on the hero section** and revealed once `activeSection !== 'hero'`. The hero already has a CTA and scroll wheel indicator; adding the nav indicator there would be too busy and premature (the indicator implies navigation choice, which is not yet appropriate on the threshold screen).

### Trigger

`shaderStore.activeSection !== 'hero'` — the existing store is the correct and sufficient signal. Do not add a separate scroll position threshold.

### Entrance / exit animations

|         | Entrance                                                                                         | Exit                                                                           |
| ------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Desktop | `translateX(calc(100% + 24px)) → translateX(0)` + opacity 0→1, 400ms `ease-out`                  | `translateX(0) → translateX(calc(100% + 24px))` + opacity 1→0, 250ms `ease-in` |
| Mobile  | `translateY(-100%) → translateY(0)` + opacity 0→1, 400ms `ease-out` (slides from behind nav bar) | `translateY(0) → translateY(-100%)` + opacity 1→0, 250ms `ease-in`             |

Exits are 150ms shorter — elements stepping aside feel lighter than elements arriving.

### CSS visibility pattern

```css
/* hidden (on hero) */
.section-nav {
  opacity: 0;
  visibility: hidden;
  transform: translateX(calc(100% + 24px)); /* desktop; mobile overrides */
  transition:
    opacity 250ms ease-in,
    transform 250ms ease-in,
    visibility 0s 250ms; /* delays hidden until after fade completes */
}

/* visible (off hero) */
.section-nav.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition:
    opacity 400ms ease-out,
    transform 400ms ease-out,
    visibility 0s 0s; /* immediate — in tab order from animation start */
}
```

`visibility: hidden` removes the element from the accessibility tree and tab order. No `aria-hidden` needed. Do not use `display: none` — it prevents the entrance animation from running.

---

## Accessibility

| Requirement   | Implementation                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Landmark      | `<nav aria-label="Section navigation">` — distinct from NavBar's "Main navigation"                                                   |
| Active item   | `aria-current="true"` on the active `<a>` (not `"page"` — this is same-document navigation)                                          |
| Live region   | `aria-live="polite"` region announcing "Now in [Section] section", debounced 300ms to avoid flood during fast scrolling              |
| Keyboard      | Items are `<a>` elements — Enter/click both work natively; Tab traverses items                                                       |
| Prev/Next     | Real `<button>` elements with `aria-label="Previous section"` / `"Next section"`; native `disabled` at boundaries                    |
| Focus ring    | `:focus-visible` using `--focus-ring: oklch(80% 0.18 195)`                                                                           |
| Touch targets | 48×48px minimum for all interactive elements                                                                                         |
| Forced colors | Active dot uses `Highlight` system accent; glow is stripped — active section remains visually distinct in Windows High Contrast mode |

---

## Implementation Order

1. **Add colour tokens** — three-state nav tokens to `tokens.css`
2. **Fix `scroll-padding-top`** — in `reset.css`/`global.css` for the existing nav bar offset
3. **Create `sections.config.ts`** — `SECTION_ORDER` constant; update `SectionTracker` to consume it
4. **Build `SectionNavItem.svelte`** — presentational anchor with three-state CSS
5. **Build `SectionNavControls.svelte`** — prev/next buttons with derived targets
6. **Build `SectionNavIndicator.svelte`** — orchestrator, responsive container, fill animation scaffold, hero visibility toggle
7. **Wire into `+layout.svelte`** — add after `<NavBar />`
8. **Verify** — check `MotionToggle` collision on desktop at 1100–1280px; test reduced-motion; test keyboard navigation
