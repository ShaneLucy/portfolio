import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount } from "svelte";
import ShaderCanvas from "../../../src/lib/shader/ShaderCanvas.svelte";

function stubMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn()
    })
  );
}

class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

describe("ShaderCanvas", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.resetModules();
    stubMatchMedia();
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    unmount(instance);
    host.remove();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("mounts without throwing an error", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    expect(() => {
      instance = mount(ShaderCanvas, { target: host });
    }).not.toThrow();
  });

  it("renders a canvas element", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ShaderCanvas, { target: host });

    expect(host.querySelector("canvas")).toBeTruthy();
  });

  it("canvas has aria-hidden attribute", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ShaderCanvas, { target: host });

    const canvas = host.querySelector("canvas");
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
  });

  it("canvas has shader-canvas class", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ShaderCanvas, { target: host });

    const canvas = host.querySelector("canvas");
    expect(canvas?.classList.contains("shader-canvas")).toBe(true);
  });
});
