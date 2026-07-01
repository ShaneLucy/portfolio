---
name: component-section-nav
description: "Design spec for SectionNav component — breakpoint, visual style, three-state colour system, fill animation, ARIA pattern, active state, hero visibility"
metadata:
  type: project
---

SectionNav: A dual-layout section navigation indicator for the Liquid Light portfolio.

**Breakpoint:** 1100px (68.75rem). Below = horizontal strip (mobile). Above = vertical rail (desktop).

---

## Desktop (vertical rail, ≥1100px)

- `position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 40`
- No visible container — dots, track, buttons float as isolated chrome
- Dots: 10px span elements, `scale(0.6)` default → `scale(0.8)` hover → `scale(1.0)` active
- Active dot: `--nav-dot-active` colour + `box-shadow: 0 0 10px 4px oklch(72% 0.16 195 / 0.45)` glow
- Glow is exclusive to active — visited dots have no glow
- Labels: `position: absolute; right: calc(100% + 10px)` of 44px touch column; `opacity: 0 → 1` on hover; active label always visible
- Label pill bg: `oklch(6% 0.012 270 / 0.88)` frosted glass
- Prev (chevron-up) / Next (chevron-down): 32px visual circle, 44×44 touch target, above/below dots

**Connecting segments (desktop):**
- 1px wide, solid colour (no gradient on the line itself)
- Gap of 4px from the full-size (scale-1.0) dot edge — segment starts 9px from dot centre
- Each gap between dots has two children: background layer (`--nav-track-unvisited`, always visible) and fill layer (`--nav-track-visited`, `scaleY` animated)
- `transform: scaleY(0 → 1)` on fill layer; GPU-composited — do NOT use `height` animation
- Direction-aware `transform-origin`: `top center` for forward nav, `bottom center` for backward nav
- JS sets `data-dir="back"` attribute on fill element before transitioning; CSS attribute selector switches transform-origin

---

## Mobile (horizontal strip, <1100px)

- `position: fixed; top: 4rem; left: 0; right: 0; height: 44px; z-index: 49`
- Background: `oklch(6% 0.012 270 / 0.90)` + `backdrop-filter: blur(10px)`
- Layout: [Prev 44px][HERO flex:1][PROJECTS flex:1][ABOUT flex:1][CONTACT flex:1][Next 44px]
- Active label text: `--nav-dot-active` colour
- **No `::after` underline accent** — replaced by dot-on-track system

**Mobile track and dots:**
- 1px horizontal track: `position: absolute; height: 1px; bottom: 4px; left: 44px; right: 44px`
- Track colour: `--nav-track-unvisited` base; visited fill covers it left-to-right
- 6px dots (`width: 6px; height: 6px; border-radius: 50%`) centred on the track at each flex item's horizontal midpoint
- Dot positioned: `position: absolute; bottom: 1px` within the flex item (centres on 1px track at bottom: 4px)
- Fill uses `transform: scaleX(0 → 1)` on per-segment fill elements; direction-aware `transform-origin: left center` / `right center`

**Body offset on mobile:** `<main>` needs `padding-top: calc(4rem + 44px)` = 108px to clear both nav bar and strip.

---

## Three-State Colour System

All states use hue 195 (same as `--cool-bright`). No warm/cool hue shift — single-hue progression of lightness and chroma only.

**Dot tokens:**
- `--nav-dot-unvisited`: `oklch(32% 0.04 195)` — dim, barely-there; future sections
- `--nav-dot-visited`:   `oklch(54% 0.10 195)` — clearly "been here"; medium presence
- `--nav-dot-active`:    `oklch(72% 0.16 195)` — = `--cool-bright`; dominant + glow

**Track segment tokens:**
- `--nav-track-unvisited`: `oklch(28% 0.03 195 / 0.60)` — slightly dimmer than dot, semi-transparent
- `--nav-track-visited`:   `oklch(52% 0.09 195 / 0.75)` — connecting tissue, below dot brightness

**Scale + colour matrix:**

| State | Scale | Colour | Glow | On hover |
|---|---|---|---|---|
| Unvisited | 0.6 | `--nav-dot-unvisited` | none | → scale(0.8), no colour change |
| Visited | 0.6 | `--nav-dot-visited` | none | → scale(0.8), no colour change |
| Active | 1.0 | `--nav-dot-active` | yes | already 1.0 |

**Contrast note:** `--nav-dot-unvisited` is intentionally below 3:1 against the dark background (~2.8:1). Acceptable exception — unvisited dots are structural/decorative; the active state conveys accessible meaning via `aria-current="true"` and the live region, not colour alone.

---

## Fill Animation

**Timing (all use `ease-out` for arrivals, `ease-in` for departures):**

| Element | Delay | Duration | Easing |
|---|---|---|---|
| Segment fill (scaleY/scaleX) | 0ms | 400ms | ease-out |
| Arriving dot colour | 0ms | 250ms | ease-out |
| Arriving dot scale (→ 1.0) | 0ms | 250ms | ease-out |
| Departing dot (→ visited) | 0ms | 200ms | ease |
| Glow fade-in on active dot | 0ms | 300ms | ease-out |
| Glow fade-out on departing | 0ms | 150ms | ease-in |

The 150ms lead that segment fill has over the dot transition creates a "dot lands first, light catches up" read — physically plausible and satisfying.

**Fill direction:** Always in the direction of travel.
- Forward: `transform-origin: top center` (desktop) / `left center` (mobile)
- Backward: `transform-origin: bottom center` (desktop) / `right center` (mobile)
- JS sets `data-dir="back"` **synchronously** before any CSS transition fires

**`prefers-reduced-motion`:** The global rule (`transition-duration: 0.01ms !important`) handles everything. No component-specific reduced-motion code needed. State changes still apply via class/attribute; only animation is suppressed.

---

## Hero Section Visibility

**Decision:** The SectionNav is hidden while `activeSection === 'hero'` and enters when `activeSection` first becomes `'projects'`. This is a deliberate UX choice — the hero has its own navigation affordance (CTA + scroll indicator) and the nav would add clutter at the threshold moment.

**Implementation trigger:** `shaderStore.activeSection !== 'hero'`. Do NOT create an independent scroll threshold — the store is the single source of truth for active section.

**Entrance animation (fires when leaving hero):**
- Desktop: `transform: translateX(calc(100% + 24px)) → translateX(0)` + `opacity: 0 → 1`; 400ms ease-out
- Mobile: `transform: translateY(-100%) → translateY(0)` + `opacity: 0 → 1`; 400ms ease-out

**Exit animation (fires when scrolling back to hero):**
- Desktop: reverse translateX; 250ms ease-in
- Mobile: reverse translateY; 250ms ease-in
- Exits are 150ms faster than entrances — elements stepping aside without ceremony

**`visibility` pattern:** Control `visibility` alongside `opacity` and `transform`:
- `.is-visible`: `visibility: visible` at 0ms delay (in tab order from animation start)
- Exit: `visibility: hidden` delayed by exit duration (stays in tab order until fully hidden)
- `visibility: hidden` removes element from accessibility tree and keyboard tab order — no `aria-hidden` needed

**Prev/Next controls:** Hidden with the entire `<nav>`. On hero, Prev would be `disabled` anyway (no section before hero). Leaving orphaned disabled buttons visible would be confusing.

**Discoverability mitigation:** The entrance animation uses `translateX/Y` from outside the viewport — a confident slide-in draws the eye more reliably than a fade-in alone.

**Layout shift:** Zero — both layouts use `position: fixed` and don't participate in document flow.

---

## Semantics (unchanged from v1)

- `<nav aria-label="Section navigation">`
- Section items: `<a href="#section-id">` — NOT buttons. `aria-current="true"` on active.
- Prev/Next: `<button>` with native `disabled` when at first/last section
- `aria-live="polite" aria-atomic="true"` hidden region: "Now in [Section] section" — debounced 300ms
- Both desktop+mobile markup always in DOM; inactive layout uses `display: none`

**Why `<a>` not `<button>`:** Anchor navigation. Gives free browser behaviour (history, right-click, middle-click).
**Why `aria-current="true"` not `"page"`:** Scroll positions within one page, not cross-document navigation.

---

**Related:** [[design-tokens-liquid-light]]
