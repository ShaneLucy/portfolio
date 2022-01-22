<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { FileExplorerMenu } from "../../../types";
  import SvgLoader from "../SVGLoader.svelte";

  export let fileExplorerState: Array<FileExplorerMenu>;
  export let containerWidth: number;

  const dispatch = createEventDispatcher();
  let svgMargin: string;
  let aside: HTMLElement;

  function dispatchActiveTab(index: number) {
    dispatch("update-active-tab", {
      index,
    });
  }

  function dispatchMenuWidth(width: number) {
    dispatch("update-width", {
      width,
    });
  }

  function setSvgMargin() {
    svgMargin = window.innerWidth < 400 ? "0" : "0 0 0 0.5rem";
  }

  onMount(() => {
    dispatchMenuWidth(aside.offsetWidth);
  });

  setSvgMargin();

  window.addEventListener("resize", () => {
    setSvgMargin();
    dispatchMenuWidth(aside.offsetWidth);
  });
</script>

<aside bind:this={aside}>
  <nav>
    {#each fileExplorerState as menuItem, index}
      <div
        class:active={menuItem.active}
        on:click={() => {
          dispatchActiveTab(index);
          dispatchMenuWidth(aside.offsetWidth);
        }}
      >
        <SvgLoader svg={menuItem.name} --margin={svgMargin} />
        <a href={menuItem.name} on:click|preventDefault>
          {menuItem.name}
        </a>
      </div>
    {/each}
  </nav>
</aside>
<div style="width: {containerWidth}px">
  <main>
    {#each fileExplorerState as menuItem}
      {#if menuItem.active}
        <svelte:component this={menuItem.component} />
      {/if}
    {/each}
  </main>
</div>

<style>
  a {
    color: var(--font-secondary);
    font-size: 0.75rem;
  }

  aside {
    min-width: 27%;
    background-color: var(--background-quaternary);
    border-right: 1px solid var(--border-light);
  }

  nav {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    border-bottom: 1px solid var(--border-light);
  }

  aside + div {
    background-color: var(--background-tertiary);
    width: 100%;
    height: 100%;
  }

  main {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }

  a {
    text-decoration: none;
    text-transform: capitalize;
    font-weight: 500;
  }

  nav div {
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  nav div:hover {
    background-color: var(--border-light);
  }

  div.active {
    background-color: var(--active);
    color: var(--font-primary);
  }

  div.active:hover {
    background-color: var(--active);
  }

  div.active a {
    color: var(--font-primary);
  }

  @media (min-width: 500px) {
    nav div {
      flex-direction: row;
      column-gap: 0.35rem;
    }

    @media (orientation: portrait) {
      a {
        font-size: 1rem;
      }
    }
  }
</style>
