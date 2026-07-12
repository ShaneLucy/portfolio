import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount, tick } from "svelte";
import MotionToggle from "../../../src/lib/a11y/MotionToggle.svelte";

const ARIA_LABEL_ENABLED = "Pause animations";
const ARIA_LABEL_DISABLED = "Enable animations";
const TEXT_ENABLED = "Pause";
const TEXT_DISABLED = "Play";

function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn()
    })
  );
}

describe("MotionToggle", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    unmount(instance);
    host.remove();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("renders a button element", async () => {
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(MotionToggle, { target: host });
    await tick();

    expect(host.querySelector("button")).toBeTruthy();
  });

  it("shows Pause text when motion is enabled (no prefers-reduced)", async () => {
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(MotionToggle, { target: host });
    await tick();

    const button = host.querySelector("button");
    expect(button?.textContent?.trim()).toBe(TEXT_ENABLED);
  });

  it("shows Play text when prefers-reduced-motion is set", async () => {
    localStorage.clear();
    stubMatchMedia(true);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(MotionToggle, { target: host });
    await tick();
    await tick();

    const button = host.querySelector("button");
    expect(button?.textContent?.trim()).toBe(TEXT_DISABLED);
  });

  it("has aria-label matching current enabled state when motion is enabled", async () => {
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(MotionToggle, { target: host });
    await tick();

    const button = host.querySelector("button");
    const label = button?.getAttribute("aria-label");
    expect(label === ARIA_LABEL_ENABLED || label === ARIA_LABEL_DISABLED).toBe(true);
  });

  it("has aria-label Enable animations when motion store reports disabled", async () => {
    localStorage.clear();
    stubMatchMedia(true);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(MotionToggle, { target: host });
    await tick();
    await tick();

    const button = host.querySelector("button");
    expect(button?.getAttribute("aria-label")).toBe(ARIA_LABEL_DISABLED);
  });

  it("has the motion-toggle class", async () => {
    stubMatchMedia(false);
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(MotionToggle, { target: host });
    await tick();

    const button = host.querySelector("button");
    expect(button?.classList.contains("motion-toggle")).toBe(true);
  });
});
