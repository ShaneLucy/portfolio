<script lang="ts">
  import { onMount } from "svelte";
  import { motionStore } from "$lib/stores/motion.svelte";

  let rafId: number | null = null;

  // React to motion toggle: immediately set or remove --scroll-offset.
  $effect(() => {
    if (typeof window === "undefined") return;
    if (motionStore.enabled) {
      document.documentElement.style.setProperty("--scroll-offset", `${window.scrollY}px`);
    } else {
      document.documentElement.style.removeProperty("--scroll-offset");
    }
  });

  onMount(() => {
    function onScroll(): void {
      rafId ??= requestAnimationFrame(() => {
        if (motionStore.enabled) {
          document.documentElement.style.setProperty("--scroll-offset", `${window.scrollY}px`);
        }
        rafId = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      document.documentElement.style.removeProperty("--scroll-offset");
    };
  });
</script>
