<script lang="ts">
  import type { SectionId } from "$lib/stores/shader.svelte";

  interface Props {
    id: SectionId;
    label: string;
    state: "unvisited" | "visited" | "active";
  }

  let { id, label, state }: Props = $props();
</script>

<a href="#{id}" class="nav-item" data-state={state} aria-current={state === "active" ? "true" : undefined}>
  <span class="dot" aria-hidden="true"></span>
  <span class="label">{label}</span>
</a>

<style>
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    min-width: 48px;
    min-height: 48px;
    position: relative;
    z-index: 1;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    transition:
      background-color 250ms ease-out,
      transform 250ms ease-out,
      box-shadow 300ms ease-out;
  }

  /* Unvisited */
  .nav-item[data-state="unvisited"] .dot {
    background: var(--nav-dot-unvisited);
    transform: scale(0.6);
  }

  /* Visited */
  .nav-item[data-state="visited"] .dot {
    background: var(--nav-dot-visited);
    transform: scale(0.6);
  }

  /* Active */
  .nav-item[data-state="active"] .dot {
    background: var(--nav-dot-active);
    transform: scale(1);
    box-shadow: 0 0 10px 4px oklch(72% 0.16 195deg / 45%);
  }

  /* Hover: scale up slightly for unvisited/visited */
  .nav-item[data-state="unvisited"]:hover .dot,
  .nav-item[data-state="visited"]:hover .dot {
    transform: scale(0.8);
  }

  /* Label — desktop: show only on active or hover; mobile: always show */
  .label {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--text-secondary);
    white-space: nowrap;

    /* Readable against any WebGL shader background */
    text-shadow: 0 1px 4px oklch(0% 0 0deg / 60%);
    transition:
      color 200ms ease,
      opacity 200ms ease;

    /* Desktop: hide labels, show on hover/active */
    opacity: 0;
    pointer-events: none;
  }

  .nav-item[data-state="active"] .label {
    color: var(--nav-dot-active);
    opacity: 1;
  }

  .nav-item:hover .label {
    opacity: 1;
  }

  /* Mobile: always show labels */
  @media (width <= 1099px) {
    .label {
      opacity: 1;
      pointer-events: auto;
      color: var(--text-secondary);
    }

    .nav-item[data-state="active"] .label {
      color: var(--nav-dot-active);
    }

    /* Mobile: dot on track (bottom), label floats above.
       Dot is first in HTML so column-reverse puts it below the label. */
    .nav-item {
      flex-direction: column-reverse;
      gap: 0.25rem;
      align-items: center;
      justify-content: flex-end;
    }
  }

  /* Forced colors (Windows High Contrast) */
  @media (forced-colors: active) {
    .nav-item[data-state="active"] .dot {
      background: Highlight;
      box-shadow: none;
    }
  }
</style>
