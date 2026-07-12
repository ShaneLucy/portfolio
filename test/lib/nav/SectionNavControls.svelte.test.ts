import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { mount, unmount } from "svelte";
import SectionNavControls from "../../../src/lib/nav/SectionNavControls.svelte";
import type { SectionId } from "../../../src/lib/stores/shader.svelte";

const PREV_ID: SectionId = "hero";
const NEXT_ID: SectionId = "about";

describe("SectionNavControls", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { hash: "" },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    unmount(instance);
    host.remove();
  });

  it("disables previous button when prevId is null", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: null, nextId: NEXT_ID } });

    const prevBtn = host.querySelector<HTMLButtonElement>(".ctrl-prev-btn");
    expect(prevBtn?.disabled).toBe(true);
  });

  it("disables next button when nextId is null", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: PREV_ID, nextId: null } });

    const nextBtn = host.querySelector<HTMLButtonElement>(".ctrl-next-btn");
    expect(nextBtn?.disabled).toBe(true);
  });

  it("enables previous button when prevId is provided", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: PREV_ID, nextId: null } });

    const prevBtn = host.querySelector<HTMLButtonElement>(".ctrl-prev-btn");
    expect(prevBtn?.disabled).toBe(false);
  });

  it("enables next button when nextId is provided", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: null, nextId: NEXT_ID } });

    const nextBtn = host.querySelector<HTMLButtonElement>(".ctrl-next-btn");
    expect(nextBtn?.disabled).toBe(false);
  });

  it("both buttons are enabled when both ids are provided", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: PREV_ID, nextId: NEXT_ID } });

    const prevBtn = host.querySelector<HTMLButtonElement>(".ctrl-prev-btn");
    const nextBtn = host.querySelector<HTMLButtonElement>(".ctrl-next-btn");
    expect(prevBtn?.disabled).toBe(false);
    expect(nextBtn?.disabled).toBe(false);
  });

  it("clicking next button sets location.hash to the next section id", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: PREV_ID, nextId: NEXT_ID } });

    const nextBtn = host.querySelector<HTMLButtonElement>(".ctrl-next-btn");
    nextBtn?.click();

    expect(window.location.hash).toBe(NEXT_ID);
  });

  it("clicking prev button sets location.hash to the prev section id", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: PREV_ID, nextId: NEXT_ID } });

    const prevBtn = host.querySelector<HTMLButtonElement>(".ctrl-prev-btn");
    prevBtn?.click();

    expect(window.location.hash).toBe(PREV_ID);
  });

  it("has aria-label Previous section on prev button", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: null, nextId: null } });

    const prevBtn = host.querySelector(".ctrl-prev-btn");
    expect(prevBtn?.getAttribute("aria-label")).toBe("Previous section");
  });

  it("has aria-label Next section on next button", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    instance = mount(SectionNavControls, { target: host, props: { prevId: null, nextId: null } });

    const nextBtn = host.querySelector(".ctrl-next-btn");
    expect(nextBtn?.getAttribute("aria-label")).toBe("Next section");
  });
});
