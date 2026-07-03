const STORAGE_KEY = "motion-enabled";

function createMotionStore() {
  let prefersReduced = $state(false);
  let userOverride = $state<boolean | null>(null);

  const enabled = $derived(userOverride !== null ? userOverride : !prefersReduced);

  function init() {
    if (typeof window === "undefined") {
      return;
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced = mq.matches;
    mq.addEventListener("change", (e) => {
      prefersReduced = e.matches;
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      userOverride = stored === "true";
    }
  }

  function toggle() {
    userOverride = !enabled;
    localStorage.setItem(STORAGE_KEY, String(userOverride));
  }

  return {
    get enabled() {
      return enabled;
    },
    init,
    toggle
  };
}

export const motionStore = createMotionStore();
