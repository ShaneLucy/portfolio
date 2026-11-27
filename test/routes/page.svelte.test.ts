import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount } from "svelte";
import Page from "../../src/routes/+page.svelte";

const SECTION_IDS = ["hero", "projects", "about", "contact"] as const;

function stubMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn()
    })
  );
}

describe("+page.svelte", () => {
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

  it("mounts without throwing an error", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    expect(() => {
      instance = mount(Page, { target: host });
    }).not.toThrow();
  });

  it.each(SECTION_IDS)("renders the %s section", (sectionId) => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(Page, { target: host });

    expect(host.querySelector(`#${sectionId}`)).toBeTruthy();
  });
});
