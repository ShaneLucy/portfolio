<script lang="ts">
  import { onMount } from "svelte";
  import { motionStore } from "$lib/stores/motion.svelte";

  onMount(() => {
    motionStore.init();
  });
</script>

<button
  class="motion-toggle type-label"
  onclick={() => motionStore.toggle()}
  aria-label={motionStore.enabled ? "Pause animations" : "Enable animations"}
  aria-pressed={motionStore.enabled}
>
  {motionStore.enabled ? "Pause" : "Play"}
</button>

<style>
  .motion-toggle {
    position: fixed;
    bottom: var(--space-6);
    right: var(--space-6);
    background: var(--surface-raised);
    color: var(--text-secondary);
    border: 1px solid var(--surface-overlay);
    padding: var(--space-2) var(--space-4);
    border-radius: 2rem;
    cursor: pointer;
    z-index: 100;
    transition:
      color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .motion-toggle:hover {
    color: var(--text-primary);
    border-color: var(--text-tertiary);
  }
</style>
