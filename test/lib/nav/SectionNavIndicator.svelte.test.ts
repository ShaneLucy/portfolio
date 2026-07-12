import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount } from "svelte";
import SectionNavIndicator from "../../../src/lib/nav/SectionNavIndicator.svelte";

const SECTION_NAV_LABEL = "Section navigation";
const SECTION_COUNT = 4;

function stubMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn()
    })
  );
}

describe("SectionNavIndicator", () => {
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
  });

  it("renders a nav element", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavIndicator, { target: host });

    expect(host.querySelector("nav")).toBeTruthy();
  });

  it("nav has aria-label Section navigation", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavIndicator, { target: host });

    const nav = host.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe(SECTION_NAV_LABEL);
  });

  it("has is-visible class on nav", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavIndicator, { target: host });

    const nav = host.querySelector("nav");
    expect(nav?.classList.contains("is-visible")).toBe(true);
  });

  it("renders an aria-live announcement region", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavIndicator, { target: host });

    const liveRegion = host.querySelector("[aria-live='polite']");
    expect(liveRegion).toBeTruthy();
  });

  it("renders one nav item per section", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavIndicator, { target: host });

    const items = host.querySelectorAll(".nav-item");
    expect(items).toHaveLength(SECTION_COUNT);
  });

  it("first section item is marked active by default", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavIndicator, { target: host });

    const activeItem = host.querySelector(".nav-item[data-state='active']");
    expect(activeItem).toBeTruthy();
  });
});
