<script lang="ts">
  import { shaderStore } from "$lib/stores/shader.svelte";
  import { SECTION_ORDER } from "$lib/nav/sections.config";
  import SectionNavItem from "./SectionNavItem.svelte";
  import SectionNavControls from "./SectionNavControls.svelte";

  const currentIndex = $derived(
    Math.max(
      0,
      SECTION_ORDER.findIndex((s) => s.id === shaderStore.activeSection)
    )
  );

  const prevId = $derived(currentIndex > 0 ? SECTION_ORDER[currentIndex - 1].id : null);
  const nextId = $derived(currentIndex < SECTION_ORDER.length - 1 ? SECTION_ORDER[currentIndex + 1].id : null);

  const isVisible = $derived(true);

  function sectionState(index: number): "unvisited" | "visited" | "active" {
    if (index === currentIndex) {
      return "active";
    }
    if (index < currentIndex) {
      return "visited";
    }
    return "unvisited";
  }

  function segmentFilled(index: number): boolean {
    return index < currentIndex;
  }

  // aria-live="polite" queues announcements, so $derived is sufficient
  const announcement = $derived(
    (() => {
      const section = SECTION_ORDER.find((s) => s.id === shaderStore.activeSection);
      return section ? `Now in ${section.label} section` : "";
    })()
  );
</script>

<nav class="section-nav" class:is-visible={isVisible} aria-label="Section navigation">
  <div class="nav-inner" role="list">
    <SectionNavControls {prevId} {nextId} />

    {#each SECTION_ORDER as section, i (section.id)}
      <div class="item-wrap" role="listitem">
        <SectionNavItem id={section.id} label={section.label} state={sectionState(i)} />

        {#if i < SECTION_ORDER.length - 1}
          <div class="segment" data-filled={segmentFilled(i) ? "true" : "false"} aria-hidden="true">
            <div class="segment-bg"></div>
            <div class="segment-fill"></div>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Live region for screen readers -->
  <div class="visually-hidden" aria-live="polite" aria-atomic="true">
    {announcement}
  </div>
</nav>

<style>
  /* ── Container ───────────────────────────────────────────── */

  .section-nav {
    position: fixed;
    z-index: 40;

    /* Desktop: right rail */
    right: 1.5rem;
    top: 50%;
    transform: translateX(calc(100% + 24px)) translateY(-50%);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 250ms ease-in,
      transform 250ms ease-in,
      visibility 0s 250ms;
  }

  .section-nav.is-visible {
    transform: translateX(0) translateY(-50%);
    opacity: 1;
    visibility: visible;
    transition:
      opacity 400ms ease-out,
      transform 400ms ease-out,
      visibility 0s 0s;
  }

  /* ── Inner layout (desktop: column) ─────────────────────── */

  .nav-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* ── Item wrap + segment ─────────────────────────────────── */

  .item-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .segment {
    position: relative;
    width: 1px;
    height: 80px;
    overflow: visible;
    margin: -24px auto 0;
    z-index: 0;
  }

  .segment-bg,
  .segment-fill {
    position: absolute;
    inset: 0;
    width: 1px;
  }

  .segment-bg {
    background: var(--nav-track-unvisited);
  }

  .segment-fill {
    background: var(--nav-track-visited);
    transform: scaleY(0);
    transform-origin: top center;
    transition: transform 400ms ease-out;
  }

  .segment[data-filled="true"] .segment-fill {
    transform: scaleY(1);
  }

  /* ── Mobile ──────────────────────────────────────────────── */

  @media (width <= 1099px) {
    .section-nav {
      /* Mobile: floating pill at bottom-centre */
      inset: auto auto var(--space-8) 50%;
      width: auto;
      transform: translateX(-50%) translateY(calc(100% + 2rem));
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 250ms ease-in,
        transform 250ms ease-in,
        visibility 0s 250ms;
    }

    .section-nav.is-visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      visibility: visible;
      transition:
        opacity 400ms ease-out,
        transform 400ms ease-out,
        visibility 0s 0s;
    }

    .nav-inner {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0;
      gap: 0;
      position: relative;
    }

    /* Mobile: horizontal segments */
    .item-wrap {
      flex-direction: row;
      align-items: center;
    }

    .segment {
      width: 80px;
      height: 1px;
      margin-top: 0;
      margin-left: -24px;
    }

    .segment-bg,
    .segment-fill {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 1px;
    }

    .segment-fill {
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 400ms ease-out;
    }

    .segment[data-filled="true"] .segment-fill {
      transform: scaleX(1);
    }
  }
</style>
