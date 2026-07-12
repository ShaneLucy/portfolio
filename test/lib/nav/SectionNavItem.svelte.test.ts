import { describe, it, expect, afterEach } from "vitest";
import { mount, unmount } from "svelte";
import SectionNavItem from "../../../src/lib/nav/SectionNavItem.svelte";
import type { SectionId } from "../../../src/lib/stores/shader.svelte";

const SECTION_ID: SectionId = "projects";
const SECTION_LABEL = "Projects";

describe("SectionNavItem", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  afterEach(() => {
    unmount(instance);
    host.remove();
  });

  it("renders an anchor element", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "unvisited" } });

    expect(host.querySelector("a")).toBeTruthy();
  });

  it("sets href to the section id fragment", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "unvisited" } });

    const anchor = host.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe(`#${SECTION_ID}`);
  });

  it("sets data-state to unvisited when state is unvisited", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "unvisited" } });

    const anchor = host.querySelector("a");
    expect(anchor?.getAttribute("data-state")).toBe("unvisited");
  });

  it("sets data-state to visited when state is visited", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "visited" } });

    const anchor = host.querySelector("a");
    expect(anchor?.getAttribute("data-state")).toBe("visited");
  });

  it("sets data-state to active when state is active", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "active" } });

    const anchor = host.querySelector("a");
    expect(anchor?.getAttribute("data-state")).toBe("active");
  });

  it("sets aria-current to true when state is active", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "active" } });

    const anchor = host.querySelector("a");
    expect(anchor?.getAttribute("aria-current")).toBe("true");
  });

  it("does not set aria-current when state is unvisited", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "unvisited" } });

    const anchor = host.querySelector("a");
    expect(anchor?.hasAttribute("aria-current")).toBe(false);
  });

  it("does not set aria-current when state is visited", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "visited" } });

    const anchor = host.querySelector("a");
    expect(anchor?.hasAttribute("aria-current")).toBe(false);
  });

  it("renders the label text", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavItem, { target: host, props: { id: SECTION_ID, label: SECTION_LABEL, state: "unvisited" } });

    const label = host.querySelector(".label");
    expect(label?.textContent?.trim()).toBe(SECTION_LABEL);
  });
});
