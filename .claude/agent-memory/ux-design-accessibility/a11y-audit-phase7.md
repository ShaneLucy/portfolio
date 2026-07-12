---
name: a11y-audit-phase7
description: WCAG 2.2 AA audit findings and fixes applied in Phase 7 — patterns to keep consistent going forward
metadata:
  type: project
---

Phase 7 accessibility audit completed 2026-07-12. All fixes applied, all verification commands pass.

## Fixes applied

### `src/app.html`
Removed non-standard `<meta name="text-scale" content="scale">` tag. `lang="en"` was already correct.

### `src/lib/a11y/MotionToggle.svelte`
Added `aria-pressed={motionStore.enabled}` — toggle buttons must expose pressed state, not just label change.
Replaced hardcoded `oklch(20%…)` / `oklch(35%…)` border colours with `--surface-overlay` and `--text-tertiary`.

### `src/lib/a11y/SkipLink.svelte`
Replaced `left: -10000px` offscreen technique with `clip-path: inset(50%)` (prevents horizontal scroll at 200%+ zoom).
Changed `:focus` to `:focus-visible` for the reveal rule — correct modern pattern.
Moved `padding` into the `:focus-visible` rule so it only applies when visible.

### `src/lib/nav/NavBar.svelte`
Replaced hardcoded background/border oklch values with `color-mix(in oklch, var(--surface-base) 85%, transparent)` and `color-mix(in oklch, var(--surface-raised) 60%, transparent)`.

### `src/lib/sections/HeroSection.svelte`
Fixed WCAG SC 2.5.3 (Label in Name) violation: `aria-label="View my projects"` did not contain the visible text "See the work". Removed the `aria-label`; wrapped the `↓` arrow in `aria-hidden="true"` so the accessible name is "See the work" — matching the visible label.

### `src/lib/projects/ProjectCard.svelte`
- `aria-controls` pointed to an `id` that only existed when `expanded` was true. Fixed by rendering a `<div id={contentId} hidden>` in the collapsed branch so the `aria-controls` target is always in the DOM (ARIA spec requires the referenced element to exist).
- Wrapped "Less ↑" / "More ↓" button text in `aria-hidden="true"` and added a descriptive `aria-label` (`"Expand/Collapse {title} details"`) so screen readers get unambiguous announcements instead of literal arrow characters.
- Replaced hardcoded oklch border/badge colours with `--surface-overlay`, `--surface-raised`, `color-mix()`.

### `src/lib/sections/ContactSection.svelte`
Added `aria-label="GitHub profile (opens in a new tab)"` on the external GitHub link. Wrapped `↗` glyphs in `aria-hidden="true"` — they are decorative; the accessible name now comes from the `aria-label`.
Replaced hardcoded `oklch(30%…)` border with `--surface-overlay`.

### `src/lib/sections/ProjectsSection.svelte`
Applied same new-tab disclosure pattern as ContactSection: each project GitHub link now has `aria-label="{Project} on GitHub (opens in a new tab)"` and `↗` wrapped in `aria-hidden`.

### `src/lib/sections/AboutSection.svelte`
Replaced `oklch(15% 0.015 270deg / 60%)` skill-group border with `color-mix(in oklch, var(--surface-raised) 60%, transparent)`.

## Patterns established

- **New-tab links**: always add `aria-label="… (opens in a new tab)"` + `aria-hidden` on the `↗` glyph. Never rely on the glyph alone.
- **Toggle buttons**: use `aria-pressed` in addition to a state-aware `aria-label`.
- **aria-controls**: the target element must exist in the DOM at all times; render a `hidden` placeholder when the controlled content is collapsed.
- **Label in Name (SC 2.5.3)**: `aria-label` must contain the visible text string, or be omitted entirely. Never write an `aria-label` that diverges from visible text.
- **Hardcoded OKLCH**: always replace with tokens or `color-mix(in oklch, var(--token) N%, transparent)`. No raw oklch literals in component CSS.
- **Skip link**: use `clip-path: inset(50%)` not `left: -10000px`. Reveal in `:focus-visible`, not `:focus`.

**Why:** to apply consistently and avoid regressing on these patterns in future components.
