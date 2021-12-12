<script lang="ts">
  import type { FileExplorerMenu } from '../../../types';
  import SvgLoader from '../SVGLoader.svelte';

  export let fileExplorerState: Array<FileExplorerMenu>;

  const switchTabs = (name: string): void => {
    fileExplorerState.forEach((menuItem, index) => {
      if (menuItem.name === name) {
        fileExplorerState[index].active = true;
      } else {
        fileExplorerState[index].active = false;
      }
    });
  };

  let svgMargin: string;
  function setSvgMargin() {
    svgMargin = window.innerWidth < 400 ? '0' : '0 0 0 0.5rem';
  }

  //   const previousTab = (): void => {
  //   const index = $fileExplorerState.findIndex((x) => x.active === true);

  //   if (index > 0) {
  //     $fileExplorerState[index].active = false;
  //     $fileExplorerState[index - 1].active = true;
  //   }
  // };

  // const nextTab = (): void => {
  //   const index = $fileExplorerState.findIndex((x) => x.active === true);

  //   if (index + 1 < $fileExplorerState.length) {
  //     $fileExplorerState[index].active = false;
  //     $fileExplorerState[index + 1].active = true;
  //   }
  // };

  setSvgMargin();
  window.addEventListener('resize', setSvgMargin);
</script>

<aside>
  <nav>
    {#each fileExplorerState as menuItem}
      <div class:active={menuItem.active} on:click={() => switchTabs(menuItem.name)}>
        <SvgLoader svg={menuItem.name} --margin={svgMargin} />
        <a href={menuItem.name} on:click|preventDefault>
          {menuItem.name}
        </a>
      </div>
    {/each}
  </nav>
</aside>
<div>
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
    width: calc(100% - 1.5rem);
    height: calc(100% - 1.5rem);
    margin: 0.75rem;
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
