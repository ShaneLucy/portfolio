<script lang="ts">
  import type { Snippet } from 'svelte';
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { motionStore } from '$lib/stores/motion.svelte';

  type Project = {
    id: string;
    title: string;
    hook: string;
    tech: readonly string[];
    narrative: string;
  };

  let { project, links }: { project: Project; links?: Snippet } = $props();

  let expanded = $state(false);
  const contentId = $derived(`project-${project.id}-content`);

  function toggle() {
    expanded = !expanded;
  }
</script>

<article class="project-card" class:expanded>
  <div class="card-summary">
    <h3 class="card-title">{project.title}</h3>
    <p class="card-hook">{project.hook}</p>
    <ul class="card-tech" role="list" aria-label="Technologies used">
      {#each project.tech as tech (tech)}
        <li class="tech-badge type-label">{tech}</li>
      {/each}
    </ul>
    <div class="card-actions">
      {#if links}
        {@render links()}
      {/if}
      <button
        class="card-expand type-label"
        onclick={toggle}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        {expanded ? 'Less ↑' : 'More ↓'}
      </button>
    </div>
  </div>

  {#if expanded}
    <div
      id={contentId}
      class="card-detail"
      transition:slide={{ duration: motionStore.enabled ? 350 : 0, easing: cubicOut }}
    >
      <p>{project.narrative}</p>
    </div>
  {/if}
</article>

<style>
  .project-card {
    background: var(--surface-raised);
    border: 1px solid oklch(15% 0.015 270 / 0.6);
    border-radius: 0.5rem;
    overflow: hidden;
    transition: border-color var(--transition-normal);
  }

  .project-card:hover,
  .project-card.expanded {
    border-color: oklch(30% 0.02 270);
  }

  .card-summary {
    padding: var(--space-8);
  }

  .card-title {
    font-size: var(--text-xl);
    margin-bottom: var(--space-3);
    font-variation-settings: 'wght' 600;
  }

  .card-hook {
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
    line-height: var(--leading-snug);
  }

  .card-tech {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    list-style: none;
    margin: 0 0 var(--space-6);
    padding: 0;
  }

  .tech-badge {
    background: oklch(14% 0.018 270);
    color: var(--text-secondary);
    padding: var(--space-1) var(--space-3);
    border-radius: 2rem;
    border: 1px solid oklch(20% 0.015 270);
  }

  .card-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .card-expand {
    margin-left: auto;
    color: var(--text-tertiary);
    transition: color var(--transition-fast);
  }

  .card-expand:hover {
    color: var(--text-secondary);
  }

  .card-detail {
    padding: var(--space-6) var(--space-8) var(--space-8);
    border-top: 1px solid oklch(15% 0.015 270 / 0.6);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
  }
</style>
