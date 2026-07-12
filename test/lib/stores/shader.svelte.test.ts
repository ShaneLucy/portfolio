import { describe, it, expect, beforeEach, vi } from "vitest";
import type { SectionId } from "../../../src/lib/stores/shader.svelte.ts";

const VALID_SECTION_IDS: SectionId[] = ["hero", "projects", "about", "contact"];
const INITIAL_SECTION: SectionId = "hero";

async function freshShaderStore() {
  const mod = await import("../../../src/lib/stores/shader.svelte.ts");
  return mod.shaderStore;
}

beforeEach(() => {
  vi.resetModules();
});

describe("shaderStore", () => {
  it("has hero as the initial active section", async () => {
    const store = await freshShaderStore();

    expect(store.activeSection).toBe(INITIAL_SECTION);
  });

  it("updates activeSection when setSection is called", async () => {
    const store = await freshShaderStore();

    store.setSection("projects");

    expect(store.activeSection).toBe("projects");
  });

  it("accepts each valid SectionId", async () => {
    const store = await freshShaderStore();

    for (const id of VALID_SECTION_IDS) {
      store.setSection(id);

      expect(store.activeSection).toBe(id);
    }
  });
});
