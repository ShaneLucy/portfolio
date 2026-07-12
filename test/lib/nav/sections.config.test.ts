import { describe, it, expect } from "vitest";
import { SECTION_ORDER, type SectionEntry } from "../../../src/lib/nav/sections.config.ts";

const EXPECTED_SECTION_COUNT = 4;
const EXPECTED_IDS = ["hero", "projects", "about", "contact"] as const;

describe("SECTION_ORDER", () => {
  it("contains exactly 4 entries", () => {
    expect(SECTION_ORDER).toHaveLength(EXPECTED_SECTION_COUNT);
  });

  it("each entry has a non-empty id and label", () => {
    for (const entry of SECTION_ORDER) {
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });

  it("contains the ids hero, projects, about, contact in order", () => {
    const ids = SECTION_ORDER.map((entry: SectionEntry) => entry.id);
    expect(ids).toEqual(EXPECTED_IDS);
  });
});
