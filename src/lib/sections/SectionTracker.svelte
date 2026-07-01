<script lang="ts">
  import { onMount } from 'svelte';
  import { shaderStore } from '$lib/stores/shader.svelte';
  import { SECTION_ORDER } from '$lib/nav/sections.config';

  onMount(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            shaderStore.setSection(
              entry.target.id as Parameters<typeof shaderStore.setSection>[0]
            );
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    for (const { id } of SECTION_ORDER) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    return () => io.disconnect();
  });
</script>
