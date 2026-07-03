export type SectionId = "hero" | "projects" | "about" | "contact";

function createShaderStore() {
  let activeSection = $state<SectionId>("hero");
  return {
    get activeSection() {
      return activeSection;
    },
    setSection(id: SectionId) {
      activeSection = id;
    }
  };
}

export const shaderStore = createShaderStore();
