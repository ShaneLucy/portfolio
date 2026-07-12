import { describe, it, expect, afterEach } from "vitest";
import { mount, unmount } from "svelte";
import ContactSection from "../../../src/lib/sections/ContactSection.svelte";

const SECTION_ID = "contact";
const HEADING_TEXT = "Get in touch";
const HEADING_ID = "contact-heading";
const EMAIL_HREF = "mailto:shanelucy01@protonmail.com";
const GITHUB_HREF = "https://github.com/shanelucy";

describe("ContactSection", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  afterEach(() => {
    unmount(instance);
    host.remove();
  });

  it("renders a section with id contact", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ContactSection, { target: host });

    const section = host.querySelector(`#${SECTION_ID}`);
    expect(section).toBeTruthy();
  });

  it("renders h2 with text Get in touch", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ContactSection, { target: host });

    const heading = host.querySelector("h2");
    expect(heading?.textContent?.trim()).toBe(HEADING_TEXT);
  });

  it("h2 has id contact-heading", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ContactSection, { target: host });

    const heading = host.querySelector(`#${HEADING_ID}`);
    expect(heading?.tagName).toBe("H2");
  });

  it("section is labelled by contact-heading", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ContactSection, { target: host });

    const section = host.querySelector("section");
    expect(section?.getAttribute("aria-labelledby")).toBe(HEADING_ID);
  });

  it("renders an email link", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ContactSection, { target: host });

    const links = Array.from(host.querySelectorAll("a"));
    const emailLink = links.find((el) => el.getAttribute("href") === EMAIL_HREF);
    expect(emailLink).toBeTruthy();
  });

  it("renders a GitHub link", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(ContactSection, { target: host });

    const links = Array.from(host.querySelectorAll("a"));
    const githubLink = links.find((el) => el.getAttribute("href") === GITHUB_HREF);
    expect(githubLink).toBeTruthy();
  });
});
