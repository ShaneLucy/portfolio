<script lang="ts">
  // import fileExplorerMenu from '../../../../state/file-explorer-state';
  import type { FileExplorerMenu } from '../../../../types';
  import SvgLoader from '../../SVGLoader.svelte';

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
</script>

<aside>
  <nav>
    {#each fileExplorerState as menuItem}
      <span
        class:active={menuItem.active}
        on:click={() => switchTabs(menuItem.name)}
      >
        <SvgLoader svg={menuItem.name} --margin="0 0 0 0.5rem" />
        <a href={menuItem.name} on:click|preventDefault>
          {menuItem.name}
        </a>
      </span>
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

  nav span {
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    cursor: pointer;
  }

  nav span:hover {
    background-color: var(--border-light);
  }

  span.active {
    background-color: var(--active);
    color: var(--font-primary);
  }

  span.active:hover {
    background-color: var(--active);
  }

  span.active a {
    color: var(--font-primary);
  }
</style>
