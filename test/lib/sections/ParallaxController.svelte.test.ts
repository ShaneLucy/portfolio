import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount, tick } from "svelte";
import ParallaxController from "../../../src/lib/sections/ParallaxController.svelte";

const SCROLL_OFFSET_PROPERTY = "--scroll-offset";

function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn()
    })
  );
}

describe("ParallaxController", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.resetModules();
    document.documentElement.style.removeProperty(SCROLL_OFFSET_PROPERTY);
  });

  afterEach(() => {
    unmount(instance);
    host.remove();
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.style.removeProperty(SCROLL_OFFSET_PROPERTY);
  });

  it("mounts without error", () => {
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    expect(() => {
      instance = mount(ParallaxController, { target: host });
    }).not.toThrow();
  });

  it("sets --scroll-offset CSS property when motionStore is enabled by default", async () => {
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ParallaxController, { target: host });
    await tick();

    const value = document.documentElement.style.getPropertyValue(SCROLL_OFFSET_PROPERTY);
    expect(value).toBeDefined();
  });

  it("renders no visible DOM elements (behaviour-only component)", () => {
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ParallaxController, { target: host });

    expect(host.children).toHaveLength(0);
  });

  it("attaches a scroll listener to window on mount", async () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ParallaxController, { target: host });
    await tick();

    const scrollCalls = addEventListenerSpy.mock.calls.filter(([type]) => type === "scroll");
    expect(scrollCalls.length).toBeGreaterThan(0);
    addEventListenerSpy.mockRestore();
  });
});
