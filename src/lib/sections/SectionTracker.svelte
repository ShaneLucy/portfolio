<script lang="ts">
  import { onMount } from 'svelte';
  import { shaderStore, type SectionId } from '$lib/stores/shader.svelte';

  const SECTION_IDS: SectionId[] = ['hero', 'projects', 'about', 'contact'];

  onMount(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            shaderStore.setSection(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    return () => io.disconnect();
  });
</script>
