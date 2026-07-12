import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount } from "svelte";
import ProjectsSection from "../../../src/lib/sections/ProjectsSection.svelte";

const SECTION_ID = "projects";
const HEADING_TEXT = "Projects";
const PROJECT_TITLES = ["db-documenter", "Travel Blog"] as const;

function stubMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn()
    })
  );
}

describe("ProjectsSection", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.resetModules();
    stubMatchMedia();
  });

  afterEach(() => {
    unmount(instance);
    host.remove();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("renders a section with id projects", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectsSection, { target: host });

    const section = host.querySelector(`#${SECTION_ID}`);
    expect(section).toBeTruthy();
  });

  it("renders Projects heading", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectsSection, { target: host });

    const heading = host.querySelector("h2");
    expect(heading?.textContent?.trim()).toBe(HEADING_TEXT);
  });

  it("renders the db-documenter project card", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectsSection, { target: host });

    const titles = Array.from(host.querySelectorAll(".card-title")).map((el) => el.textContent?.trim());
    expect(titles).toContain(PROJECT_TITLES[0]);
  });

  it("renders the Travel Blog project card", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectsSection, { target: host });

    const titles = Array.from(host.querySelectorAll(".card-title")).map((el) => el.textContent?.trim());
    expect(titles).toContain(PROJECT_TITLES[1]);
  });

  it("renders the correct number of project cards", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectsSection, { target: host });

    const cards = host.querySelectorAll("article.project-card");
    expect(cards).toHaveLength(PROJECT_TITLES.length);
  });
});
