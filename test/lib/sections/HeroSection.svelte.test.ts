import { describe, it, expect, afterEach } from "vitest";
import { mount, unmount } from "svelte";
import HeroSection from "../../../src/lib/sections/HeroSection.svelte";

const HERO_NAME = "Shane Lucy";
const HERO_CTA_HREF = "#projects";
const SECTION_ID = "hero";
const HEADING_ID = "hero-heading";

describe("HeroSection", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  afterEach(() => {
    unmount(instance);
    host.remove();
  });

  it("renders a section with id hero", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(HeroSection, { target: host });

    const section = host.querySelector(`#${SECTION_ID}`);
    expect(section).toBeTruthy();
  });

  it("renders h1 with id hero-heading", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(HeroSection, { target: host });

    const heading = host.querySelector(`#${HEADING_ID}`);
    expect(heading?.tagName).toBe("H1");
  });

  it("h1 contains the name Shane Lucy", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(HeroSection, { target: host });

    const heading = host.querySelector("h1");
    expect(heading?.textContent?.trim()).toBe(HERO_NAME);
  });

  it("renders a CTA link pointing to projects section", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(HeroSection, { target: host });

    const cta = host.querySelector(".hero-cta");
    expect(cta?.getAttribute("href")).toBe(HERO_CTA_HREF);
  });

  it("section is labelled by hero-heading", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(HeroSection, { target: host });

    const section = host.querySelector("section");
    expect(section?.getAttribute("aria-labelledby")).toBe(HEADING_ID);
  });
});
