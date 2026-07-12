import { describe, it, expect, vi, beforeEach } from "vitest";

const STORAGE_KEY = "motion-enabled";

type MediaQueryChangeHandler = (e: { matches: boolean }) => void;

function makeMatchMedia(matches: boolean) {
  const listeners: MediaQueryChangeHandler[] = [];
  return {
    mq: {
      matches,
      addEventListener(_event: string, handler: MediaQueryChangeHandler) {
        listeners.push(handler);
      }
    },
    triggerChange(newMatches: boolean) {
      for (const handler of listeners) {
        handler({ matches: newMatches });
      }
    }
  };
}

function stubMatchMedia(matches: boolean) {
  const { mq, triggerChange } = makeMatchMedia(matches);
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mq));
  return { triggerChange };
}

async function freshMotionStore() {
  const mod = await import("../../../src/lib/stores/motion.svelte.ts");
  return mod.motionStore;
}

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("motionStore", () => {
  describe("enabled default", () => {
    it("is true when prefersReduced is false and no override is set", async () => {
      stubMatchMedia(false);
      const store = await freshMotionStore();

      store.init();

      expect(store.enabled).toBe(true);
    });
  });

  describe("init()", () => {
    it("sets enabled to false when matchMedia reports prefers-reduced-motion", async () => {
      stubMatchMedia(true);
      const store = await freshMotionStore();

      store.init();

      expect(store.enabled).toBe(false);
    });

    it("reads a stored true override from localStorage", async () => {
      stubMatchMedia(true);
      localStorage.setItem(STORAGE_KEY, "true");
      const store = await freshMotionStore();

      store.init();

      expect(store.enabled).toBe(true);
    });

    it("reads a stored false override from localStorage", async () => {
      stubMatchMedia(false);
      localStorage.setItem(STORAGE_KEY, "false");
      const store = await freshMotionStore();

      store.init();

      expect(store.enabled).toBe(false);
    });

    it("is a no-op when window is undefined", async () => {
      vi.stubGlobal("window", undefined);
      const store = await freshMotionStore();

      store.init();

      expect(store.enabled).toBe(true);
    });
  });

  describe("toggle()", () => {
    it("flips enabled from true to false", async () => {
      stubMatchMedia(false);
      const store = await freshMotionStore();
      store.init();

      store.toggle();

      expect(store.enabled).toBe(false);
    });

    it("flips enabled from false to true", async () => {
      stubMatchMedia(true);
      const store = await freshMotionStore();
      store.init();

      store.toggle();

      expect(store.enabled).toBe(true);
    });

    it("persists the new value to localStorage after toggling off", async () => {
      stubMatchMedia(false);
      const store = await freshMotionStore();
      store.init();

      store.toggle();

      expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
    });

    it("persists the new value to localStorage after toggling on", async () => {
      stubMatchMedia(true);
      const store = await freshMotionStore();
      store.init();

      store.toggle();

      expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
    });
  });
});
