import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount, tick } from "svelte";
import ProjectCard from "../../../src/lib/projects/ProjectCard.svelte";

const EXPAND_BUTTON_COLLAPSED_TEXT = "More ↓";
const EXPAND_BUTTON_EXPANDED_TEXT = "Less ↑";
const EXPANDED_CLASS = "expanded";

const TEST_PROJECT = {
  id: "test-project",
  title: "Test Project",
  hook: "A test project hook.",
  tech: ["TypeScript", "Svelte"] as const,
  narrative: "This is the detailed narrative for the test project."
} as const;

function stubMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn()
    })
  );
}

function stubAnimate(): void {
  Element.prototype.animate = vi.fn().mockReturnValue({
    finished: Promise.resolve(),
    cancel: vi.fn(),
    finish: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  });
}

describe("ProjectCard", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.resetModules();
    stubMatchMedia();
    stubAnimate();
  });

  afterEach(() => {
    unmount(instance);
    host.remove();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("renders an article element", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    expect(host.querySelector("article")).toBeTruthy();
  });

  it("renders the project title", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const title = host.querySelector(".card-title");
    expect(title?.textContent?.trim()).toBe(TEST_PROJECT.title);
  });

  it("renders the project hook", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const hook = host.querySelector(".card-hook");
    expect(hook?.textContent?.trim()).toBe(TEST_PROJECT.hook);
  });

  it("renders all technology badges", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const badges = Array.from(host.querySelectorAll(".tech-badge")).map((el) => el.textContent?.trim());
    for (const tech of TEST_PROJECT.tech) {
      expect(badges).toContain(tech);
    }
  });

  it("shows More ↓ on the expand button initially", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const button = host.querySelector(".card-expand");
    expect(button?.textContent?.trim()).toBe(EXPAND_BUTTON_COLLAPSED_TEXT);
  });

  it("sets aria-expanded to false initially", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const button = host.querySelector(".card-expand");
    expect(button?.getAttribute("aria-expanded")).toBe("false");
  });

  it("does not render narrative detail section initially", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    expect(host.querySelector(".card-detail")).toBeFalsy();
  });

  it("article does not have expanded class initially", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const article = host.querySelector("article");
    expect(article?.classList.contains(EXPANDED_CLASS)).toBe(false);
  });

  it("shows Less ↑ after clicking expand button", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const button = host.querySelector<HTMLButtonElement>(".card-expand");
    button?.click();
    await tick();

    expect(button?.textContent?.trim()).toBe(EXPAND_BUTTON_EXPANDED_TEXT);
  });

  it("sets aria-expanded to true after clicking expand", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const button = host.querySelector<HTMLButtonElement>(".card-expand");
    button?.click();
    await tick();

    expect(button?.getAttribute("aria-expanded")).toBe("true");
  });

  it("shows narrative detail after clicking expand", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const button = host.querySelector<HTMLButtonElement>(".card-expand");
    button?.click();
    await tick();

    const detail = host.querySelector(".card-detail");
    expect(detail?.textContent?.trim()).toBe(TEST_PROJECT.narrative);
  });

  it("article has expanded class after clicking expand", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const button = host.querySelector<HTMLButtonElement>(".card-expand");
    button?.click();
    await tick();

    const article = host.querySelector("article");
    expect(article?.classList.contains(EXPANDED_CLASS)).toBe(true);
  });

  it("toggles back to collapsed state on second click", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });
    const button = host.querySelector<HTMLButtonElement>(".card-expand");

    button?.click();
    await tick();

    const expandedText = button?.textContent?.trim();
    expect(expandedText).toBe(EXPAND_BUTTON_EXPANDED_TEXT);

    button?.click();
    await tick();

    expect(button?.textContent?.trim()).toBe(EXPAND_BUTTON_COLLAPSED_TEXT);
  });

  it("aria-controls matches the detail section id", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ProjectCard, { target: host, props: { project: TEST_PROJECT } });

    const button = host.querySelector(".card-expand");
    const expectedId = `project-${TEST_PROJECT.id}-content`;
    expect(button?.getAttribute("aria-controls")).toBe(expectedId);
  });
});
