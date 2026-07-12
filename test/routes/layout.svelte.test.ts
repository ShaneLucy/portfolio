import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, unmount, createRawSnippet } from "svelte";
import Layout from "../../src/routes/+layout.svelte";

const MAIN_CONTENT_ID = "main-content";

function stubMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn()
    })
  );
}

class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

describe("+layout.svelte", () => {
  let host: HTMLDivElement;
  let instance: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.resetModules();
    stubMatchMedia();
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
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

    const childSnippet = createRawSnippet(() => ({
      render: () => "<p>child content</p>",
      setup: () => {}
    }));

    expect(() => {
      instance = mount(Layout, { target: host, props: { children: childSnippet } });
    }).not.toThrow();
  });

  it("renders main element with id main-content", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const childSnippet = createRawSnippet(() => ({
      render: () => "<p>child content</p>",
      setup: () => {}
    }));

    instance = mount(Layout, { target: host, props: { children: childSnippet } });

    const main = host.querySelector(`#${MAIN_CONTENT_ID}`);
    expect(main).toBeTruthy();
  });

  it("renders children inside main", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const childSnippet = createRawSnippet(() => ({
      render: () => "<p>child content</p>",
      setup: () => {}
    }));

    instance = mount(Layout, { target: host, props: { children: childSnippet } });

    const main = host.querySelector(`#${MAIN_CONTENT_ID}`);
    expect(main?.querySelector("p")?.textContent).toBe("child content");
  });

  it("renders main navigation", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const childSnippet = createRawSnippet(() => ({
      render: () => "<p>child content</p>",
      setup: () => {}
    }));

    instance = mount(Layout, { target: host, props: { children: childSnippet } });

    const nav = host.querySelector("nav[aria-label='Main navigation']");
    expect(nav).toBeTruthy();
  });

  it("renders skip link", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const childSnippet = createRawSnippet(() => ({
      render: () => "<p>child content</p>",
      setup: () => {}
    }));

    instance = mount(Layout, { target: host, props: { children: childSnippet } });

    const skipLink = host.querySelector(".skip-link");
    expect(skipLink).toBeTruthy();
  });
});
