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

  it("renders the hero section", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(Page, { target: host });

    expect(host.querySelector(`#${SECTION_IDS[0]}`)).toBeTruthy();
  });

  it("renders the projects section", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(Page, { target: host });

    expect(host.querySelector(`#${SECTION_IDS[1]}`)).toBeTruthy();
  });

  it("renders the about section", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(Page, { target: host });

    expect(host.querySelector(`#${SECTION_IDS[2]}`)).toBeTruthy();
  });

  it("renders the contact section", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(Page, { target: host });

    expect(host.querySelector(`#${SECTION_IDS[3]}`)).toBeTruthy();
  });
});
