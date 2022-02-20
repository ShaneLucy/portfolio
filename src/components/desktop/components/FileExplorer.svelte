<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { FileExplorerMenu } from "../../../types";
  import SvgLoader from "../SVGLoader.svelte";

  export let fileExplorerState: Array<FileExplorerMenu>;

  const dispatch = createEventDispatcher();
  let svgMargin: string;

  const dispatchActiveTab = (index: number): void => {
    dispatch("update-active-tab", {
      index,
    });
  };

  const setSvgMargin = (): void => {
    svgMargin = window.innerWidth < 400 ? "0" : "0 0 0 0.5rem";
  };

  setSvgMargin();

  window.addEventListener("resize", () => {
    setSvgMargin();
  });
</script>

<aside>
  <nav>
    {#each fileExplorerState as menuItem, index}
      <div
        class:active={menuItem.active}
        on:click={() => {
          dispatchActiveTab(index);
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
<main>
  {#each fileExplorerState as menuItem}
    {#if menuItem.active}
      <svelte:component this={menuItem.component} />
    {/if}
  {/each}
</main>

<style>
  a {
    color: var(--font-secondary);
    font-size: 0.75rem;
  }

  aside {
    min-width: 27%;
    background-color: var(--background-quaternary);
    border-right: 2px solid var(--border-light);
  }

  nav {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    border-top: 1px solid var(--border-light);
  }

  main {
    background-color: var(--background-tertiary);
    width: 100%;
    height: 100%;
    overflow-y: auto;
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
    nav {
      flex-direction: column;
      border-top: 0;
      border-bottom: 1px solid var(--border-light);
    }
    nav div {
      flex-direction: row;
      column-gap: 0.35rem;
    }

    a {
      font-size: 1rem;
    }
  }
</style>
