import { describe, it, expect, afterEach } from "vitest";
import { mount, unmount } from "svelte";
import NavBar from "../../../src/lib/nav/NavBar.svelte";

const EXPECTED_NAV_LABEL = "Main navigation";
const EXPECTED_NAV_LINKS = ["Home", "Projects", "About", "Contact"];

describe("NavBar", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  afterEach(() => {
    unmount(instance);
    host.remove();
  });

  it("renders a header element", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(NavBar, { target: host });

    expect(host.querySelector("header")).toBeTruthy();
  });

  it("renders a nav with Main navigation label", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(NavBar, { target: host });

    const nav = host.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe(EXPECTED_NAV_LABEL);
  });

  it("renders all four navigation links", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(NavBar, { target: host });

    const links = Array.from(host.querySelectorAll(".nav-link")).map((el) => el.textContent?.trim());
    for (const label of EXPECTED_NAV_LINKS) {
      expect(links).toContain(label);
    }
  });

  it("renders Home link pointing to #hero", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(NavBar, { target: host });

    const homeLink = Array.from(host.querySelectorAll(".nav-link")).find((el) => el.textContent?.trim() === "Home");
    expect(homeLink?.getAttribute("href")).toBe("#hero");
  });

  it("renders brand link", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(NavBar, { target: host });

    const brand = host.querySelector(".nav-brand");
    expect(brand).toBeTruthy();
  });
});
