<script lang="ts">
  import type { SectionId } from "$lib/stores/shader.svelte";

  interface Props {
    prevId: SectionId | null;
    nextId: SectionId | null;
  }

  let { prevId, nextId }: Props = $props();

  function navigate(id: SectionId | null): void {
    if (!id) return;
    location.hash = id;
  }
</script>

<div class="controls">
  <button class="ctrl-btn ctrl-prev-btn" aria-label="Previous section" disabled={prevId === null} onclick={() => navigate(prevId)}>
    <span aria-hidden="true" class="ctrl-icon ctrl-prev">&#8896;</span>
  </button>
  <button class="ctrl-btn ctrl-next-btn" aria-label="Next section" disabled={nextId === null} onclick={() => navigate(nextId)}>
    <span aria-hidden="true" class="ctrl-icon ctrl-next">&#8896;</span>
  </button>
</div>

<style>
  .controls {
    display: contents;
  }

  .ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: var(--text-secondary);
    transition:
      color var(--transition-fast),
      opacity var(--transition-fast);
    flex-shrink: 0;
  }

  .ctrl-btn:hover:not(:disabled) {
    color: var(--text-primary);
  }

  .ctrl-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .ctrl-icon {
    font-size: 1rem;
    line-height: 1;
  }

  /* Desktop: next button sits at the bottom of the vertical track */
  @media (min-width: 1100px) {
    .ctrl-next-btn {
      order: 999;
    }

    .ctrl-next {
      transform: rotate(180deg);
      display: inline-block;
    }
  }

  /* Mobile: rotate icons for horizontal layout and push next to end */
  @media (max-width: 1099px) {
    .ctrl-prev {
      transform: rotate(-90deg);
      display: inline-block;
    }

    .ctrl-next {
      transform: rotate(90deg);
      display: inline-block;
    }

    .ctrl-next-btn {
      order: 999;
    }
  }
</style>
