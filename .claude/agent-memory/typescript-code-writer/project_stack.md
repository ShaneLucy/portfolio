---
name: project-stack
description: Package manager, test runner, framework versions, test directory layout, and vitest project config pattern for this portfolio project
metadata:
  type: project
---

## Stack

- Package manager: **bun**
- Framework: **SvelteKit** with **Svelte 5** runes (`$state`, `$derived`)
- Test runner: **Vitest 4** (`vitest run --run` via `bun run test`)
- Test environment: jsdom for `.svelte.test.ts`, node for plain `.test.ts`

## Test directory layout

Tests live in `test/` at the project root, mirroring `src/` exactly.
- `src/lib/nav/sections.config.ts` → `test/lib/nav/sections.config.test.ts`
- `src/lib/stores/shader.svelte.ts` → `test/lib/stores/shader.svelte.test.ts`
- Svelte store tests use `.svelte.test.ts` extension to be picked up by the jsdom project.

## Vitest config pattern (`vitest.config.ts`)

The config uses a `projects` array with **two entries**:

1. **jsdom project** — `extends: "./vite.config.ts"` (SvelteKit plugin, compiles runes), includes `test/**/*.svelte.{test,spec}.{js,ts}`
2. **node project** — plain node environment, includes `test/**/*.{test,spec}.{js,ts}`, excludes `*.svelte.*` files

**Why:** When a `projects` array is defined in vitest, the top-level `include` is ignored for file collection — each file must match a project's `include`. Without the second node project, plain `.test.ts` files are silently skipped.

## Import paths in tests

Test files use relative paths to source (e.g. `../../../src/lib/nav/sections.config.ts`), NOT `$lib/` aliases, because tests live outside `src/`.

## Svelte store testing pattern

Svelte 5 singletons (`export const store = createStore()`) are tested by importing the real singleton via `vi.resetModules()` in `beforeEach` combined with a dynamic `import()` inside each test (or a `freshStore()` helper that calls dynamic import). This gives each test a fresh module instance — and therefore a fresh singleton with reset `$state` — while still exercising real source code for coverage.

```ts
async function freshMotionStore() {
  const mod = await import("../../../src/lib/stores/motion.svelte.ts");
  return mod.motionStore;
}

beforeEach(() => {
  vi.resetModules();
});
```

Runes compile correctly in `.svelte.test.ts` files because the jsdom project extends `vite.config.ts` (SvelteKit Vite plugin).

## Coverage config

`coverage.include` correctly targets `src/` (source files), not `test/`. Provider: istanbul.
