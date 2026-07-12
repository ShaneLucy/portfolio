import { describe, it, expect, afterEach } from "vitest";
import { mount, unmount } from "svelte";
import SkipLink from "../../../src/lib/a11y/SkipLink.svelte";

const SKIP_LINK_HREF = "#main-content";
const SKIP_LINK_TEXT = "Skip to main content";

describe("SkipLink", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  afterEach(() => {
    unmount(instance);
    host.remove();
  });

  it("renders an anchor element", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SkipLink, { target: host });

    expect(host.querySelector("a")).toBeTruthy();
  });

  it("links to main content", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SkipLink, { target: host });

    const anchor = host.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe(SKIP_LINK_HREF);
  });

  it("has the correct link text", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SkipLink, { target: host });

    const anchor = host.querySelector("a");
    expect(anchor?.textContent?.trim()).toBe(SKIP_LINK_TEXT);
  });

  it("has skip-link class", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SkipLink, { target: host });

    const anchor = host.querySelector("a");
    expect(anchor?.classList.contains("skip-link")).toBe(true);
  });
});
