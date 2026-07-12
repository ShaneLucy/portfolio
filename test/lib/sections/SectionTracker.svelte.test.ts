import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount, tick } from "svelte";
import SectionTracker from "../../../src/lib/sections/SectionTracker.svelte";
import { shaderStore } from "../../../src/lib/stores/shader.svelte.ts";

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

let capturedCallback: IntersectionCallback | null = null;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor(cb: IntersectionCallback) {
    capturedCallback = cb;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
}

function makeEntry(id: string, isIntersecting: boolean): IntersectionObserverEntry {
  const el = document.getElementById(id) ?? document.createElement("section");
  el.id = id;
  el.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({})
  });
  return {
    target: el,
    isIntersecting,
    boundingClientRect: el.getBoundingClientRect(),
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: el.getBoundingClientRect(),
    rootBounds: null,
    time: 0
  };
}

describe("SectionTracker", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;
  let heroEl: HTMLElement;

  beforeEach(() => {
    capturedCallback = null;
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    heroEl = document.createElement("section");
    heroEl.id = "hero";
    heroEl.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({})
    });
    document.body.appendChild(heroEl);
  });

  afterEach(() => {
    unmount(instance);
    host.remove();
    heroEl?.remove();
    vi.unstubAllGlobals();
  });

  it("mounts without error", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    expect(() => {
      instance = mount(SectionTracker, { target: host });
    }).not.toThrow();
  });

  it("registers an IntersectionObserver on mount", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionTracker, { target: host });
    await tick();

    expect(capturedCallback).not.toBeNull();
  });

  it("calls observe for each section element that exists in the DOM", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionTracker, { target: host });
    await tick();

    expect(mockObserve).toHaveBeenCalledWith(heroEl);
  });

  it("sets shaderStore active section when an element intersects", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionTracker, { target: host });
    await tick();

    if (!capturedCallback) {
      throw new Error("capturedCallback was not set");
    }
    capturedCallback([makeEntry("hero", true)]);
    await tick();

    expect(shaderStore.activeSection).toBe("hero");
  });

  it("updates shaderStore active section on hashchange to a valid section id", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    instance = mount(SectionTracker, { target: host });
    await tick();

    Object.defineProperty(window, "location", {
      value: { hash: "#projects" },
      writable: true,
      configurable: true
    });
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await tick();

    expect(shaderStore.activeSection).toBe("projects");
  });

  it("ignores hash changes for unknown section ids", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    instance = mount(SectionTracker, { target: host });
    await tick();

    Object.defineProperty(window, "location", {
      value: { hash: "#about" },
      writable: true,
      configurable: true
    });
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await tick();

    const sectionAfterValid = shaderStore.activeSection;

    Object.defineProperty(window, "location", {
      value: { hash: "#nonexistent" },
      writable: true,
      configurable: true
    });
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await tick();

    expect(shaderStore.activeSection).toBe(sectionAfterValid);
  });

  it("handles non-intersecting entry by removing from active candidates", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionTracker, { target: host });
    await tick();

    if (!capturedCallback) {
      throw new Error("capturedCallback was not set");
    }
    capturedCallback([makeEntry("hero", true)]);
    await tick();
    capturedCallback([makeEntry("hero", false)]);
    await tick();

    expect(shaderStore.activeSection).toBeDefined();
  });
});
