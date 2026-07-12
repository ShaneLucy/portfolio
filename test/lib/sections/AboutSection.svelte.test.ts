import { describe, it, expect, afterEach } from "vitest";
import { mount, unmount } from "svelte";
import AboutSection from "../../../src/lib/sections/AboutSection.svelte";

const SECTION_ID = "about";
const HEADING_TEXT = "About";
const HEADING_ID = "about-heading";

describe("AboutSection", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  afterEach(() => {
    unmount(instance);
    host.remove();
  });

  it("renders a section with id about", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(AboutSection, { target: host });

    const section = host.querySelector(`#${SECTION_ID}`);
    expect(section).toBeTruthy();
  });

  it("renders h2 with text About", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(AboutSection, { target: host });

    const heading = host.querySelector("h2");
    expect(heading?.textContent?.trim()).toBe(HEADING_TEXT);
  });

  it("h2 has id about-heading", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(AboutSection, { target: host });

    const heading = host.querySelector(`#${HEADING_ID}`);
    expect(heading?.tagName).toBe("H2");
  });

  it("section is labelled by about-heading", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(AboutSection, { target: host });

    const section = host.querySelector("section");
    expect(section?.getAttribute("aria-labelledby")).toBe(HEADING_ID);
  });

  it("renders a skills list", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(AboutSection, { target: host });

    const list = host.querySelector(".skills-list");
    expect(list).toBeTruthy();
  });
});
