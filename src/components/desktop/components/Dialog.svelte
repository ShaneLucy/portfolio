<script lang="ts">
  import { onMount } from 'svelte';
  import fileExplorerMenu from '../../../state/file-explorer-state';
  import SvgLoader from '../SVGLoader.svelte';

  import FileExplorer from './dialog/FileExplorer.svelte';

  export let openingActiveTab: 0 | 1;
  let maximise = false;
  let minimise = false;

  const minimiseContainer = (): void => {
    minimise = !minimise;
    // Add minimised container to a store
  };

  const maximiseContainer = (): void => {
    maximise = !maximise;
  };

  const closeContainer = (): void => {
    minimise = true;
  };

  export const previousTab = (): void => {
    const index = $fileExplorerMenu.findIndex((x) => x.active === true);

    if (index > 0) {
      $fileExplorerMenu[index].active = false;
      $fileExplorerMenu[index - 1].active = true;
    }
  };

  export const nextTab = (): void => {
    const index = $fileExplorerMenu.findIndex((x) => x.active === true);

    if (index + 1 < $fileExplorerMenu.length) {
      $fileExplorerMenu[index].active = false;
      $fileExplorerMenu[index + 1].active = true;
    }
  };

  onMount(() => {
    $fileExplorerMenu[openingActiveTab].active = true;
  });
</script>

<div
  class="container"
  class:normal={!maximise}
  class:max-container={maximise}
  class:min-container={minimise}
>
  <header class:max-header={maximise}>
    <div>
      <div>
        <div>
          <SvgLoader svg={'chevron-left'} on:click={previousTab} />
          <SvgLoader svg={'chevron-right'} on:click={nextTab} />
        </div>
        <div>
          {#each $fileExplorerMenu as menuItem}
            {#if menuItem.active}
              <span
                ><SvgLoader svg={menuItem.name} />
                <p>{menuItem.name}</p></span
              >
            {/if}
          {/each}
        </div>
      </div>
      <div>
        <SvgLoader svg={'minimise'} on:click={minimiseContainer} />
        <SvgLoader svg={'maximise'} on:click={maximiseContainer} />
        <SvgLoader svg={'exit'} on:click={closeContainer} />
      </div>
    </div>
  </header>

  <div class="inner-container">
    <FileExplorer />
  </div>
</div>

<style>
  .container {
    z-index: 50;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .normal {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
  }

  .max-container {
    width: 100%;
    height: 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .max-header {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .min-container {
    display: none;
  }

  header {
    background-color: var(--background-secondary);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: solid 1px var(--border-dark);
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  p {
    text-transform: capitalize;
  }

  header div {
    display: flex;
    justify-content: space-between;
  }

  header div div {
    margin-right: 0.5rem;
    display: flex;
    column-gap: 0.5rem;
  }

  header div div:nth-child(2) {
    column-gap: 1.5rem;
  }

  header div div div {
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    border: solid 1px var(--border-dark);
    background-color: var(--background-primary);
    padding: 0.4rem;
  }

  .inner-container {
    display: flex;
    width: 100%;
    height: 100%;
    color: var(--font-secondary);
  }

  span {
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
  }
</style>
