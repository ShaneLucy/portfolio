import type { SectionId } from "$lib/stores/shader.svelte";

export interface SectionEntry {
  id: SectionId;
  label: string;
}

export const SECTION_ORDER: SectionEntry[] = [
  { id: "hero", label: "Hero" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" }
];
