<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteSet } from "svelte/reactivity";
  import { shaderStore } from "$lib/stores/shader.svelte";
  import { SECTION_ORDER } from "$lib/nav/sections.config";

  onMount(() => {
    // Maintain the full set so stale entries from a batch don't override the correct one.
    const intersecting = new SvelteSet<string>();

    function pickActive() {
      // Among currently-intersecting sections, pick the one whose center
      // is closest to the viewport midpoint. This correctly resolves the
      // overlap window that occurs when two adjacent sections are both
      // briefly inside the ±40% rootMargin zone during a scroll transition.
      const mid = window.innerHeight / 2;
      let best: string | null = null;
      let bestDist = Infinity;
      for (const { id } of SECTION_ORDER) {
        if (intersecting.has(id)) {
          const el = document.getElementById(id);
          if (el) {
            const { top, height } = el.getBoundingClientRect();
            const dist = Math.abs(top + height / 2 - mid);
            if (dist < bestDist) {
              bestDist = dist;
              best = id;
            }
          }
        }
      }
      if (best) {
        shaderStore.setSection(best as Parameters<typeof shaderStore.setSection>[0]);
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        }
        pickActive();
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    for (const { id } of SECTION_ORDER) {
      const el = document.getElementById(id);
      if (el) {
        io.observe(el);
      }
    }

    // When a nav button sets location.hash, sync the active section immediately
    // so the indicator reflects the target before the scroll settles.
    function onHashChange() {
      const id = location.hash.slice(1);
      if (SECTION_ORDER.some((s) => s.id === id)) {
        shaderStore.setSection(id as Parameters<typeof shaderStore.setSection>[0]);
      }
    }

    window.addEventListener("hashchange", onHashChange);

    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  });
</script>
