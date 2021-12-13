<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { draggable } from "svelte-drag";
  import type { FileExplorerMenu } from "../../../types";
  import { dialogState } from "../../../state";
  import SvgLoader from "../SVGLoader.svelte";
  import { setDialogAsActive } from "../../../helpers";

  export let openingActiveTab: number;
  export let index: number;
  export let initialFileExplorerState: Array<FileExplorerMenu>;

  const fileExplorerState = writable<Array<FileExplorerMenu>>(initialFileExplorerState);

  let maximise = false;
  let minimise = false;

  const minimiseContainer = (): void => {
    minimise = !minimise;
    // Add minimised container to a store
  };

  const maximiseContainer = (): void => {
    maximise = !maximise;
  };

  const closeContainer = (event: Event): void => {
    event.stopPropagation();
    setDialogAsActive(event, index);

    if ($dialogState.length > 0) {
      dialogState.update((value) => {
        value.splice(index, 1);
        return value;
      });
    }
  };

  const previousTab = (): void => {
    const currentIndex = $fileExplorerState.findIndex((x) => x.active === true);

    if (currentIndex > 0) {
      $fileExplorerState[currentIndex].active = false;
      $fileExplorerState[currentIndex - 1].active = true;
    }
  };

  const nextTab = (): void => {
    const currentIndex = $fileExplorerState.findIndex((x) => x.active === true);

    if (currentIndex + 1 < $fileExplorerState.length) {
      $fileExplorerState[currentIndex].active = false;
      $fileExplorerState[currentIndex + 1].active = true;
    }
  };

  const setActiveTab = (event: Event): void => {
    $fileExplorerState.forEach((fileExplorer, i) => {
      $fileExplorerState[i].active = false;
    });
    $fileExplorerState[(<CustomEvent>event).detail.index].active = true;
  };

  onMount(() => {
    if ($fileExplorerState.length > 0) {
      $fileExplorerState[openingActiveTab].active = true;
    }
  });
</script>

<div
  use:draggable
  class="container"
  class:normal={!maximise}
  class:max-container={maximise}
  class:min-container={minimise}
  on:click
>
  <header class:max-header={maximise} class:active={$dialogState[index].active}>
    <div>
      <div>
        {#if $fileExplorerState.length > 0}
          <div>
            <SvgLoader svg={"chevron-left"} on:click={previousTab} />
            <SvgLoader svg={"chevron-right"} on:click={nextTab} />
          </div>
        {/if}
        <div>
          {#if $fileExplorerState.length > 0}
            {#each $fileExplorerState as menuItem}
              {#if menuItem.active}
                <span
                  ><SvgLoader svg={menuItem.name} />
                  <p>{menuItem.name}</p></span
                >
              {/if}
            {/each}
          {:else}
            {#each $dialogState as dialog}
              {#if dialog.active}
                <span> <p>{dialog.title}</p></span>
              {/if}
            {/each}
          {/if}
        </div>
      </div>
      <div>
        <SvgLoader svg={"minimise"} on:click={minimiseContainer} />
        <SvgLoader svg={"maximise"} on:click={maximiseContainer} />
        <SvgLoader svg={"exit"} on:click={(event) => closeContainer(event)} />
      </div>
    </div>
  </header>

  <div class="inner-container">
    {#each $dialogState as dialog, dialogIndex}
      {#if index === dialogIndex}
        <svelte:component
          this={dialog.component}
          fileExplorerState={$fileExplorerState}
          on:message={setActiveTab}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .container {
    z-index: 50;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .normal {
    left: 20%;
    position: absolute;
    width: 75%;
    height: 75%;
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
    background-color: var(--background-primary);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: solid 1px var(--border-dark);
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
  }

  header.active {
    background-color: var(--background-secondary);
  }

  p {
    text-transform: capitalize;
    font-size: 0.75rem;
  }

  header div {
    display: flex;
    justify-content: end;
  }

  header div div {
    margin-right: 0.5rem;
    display: flex;
    column-gap: 0.5rem;
  }

  header div div:nth-child(1) {
    display: none;
  }

  header div div:nth-child(2) {
    column-gap: 1.5rem;
  }

  header div div div {
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    border: solid 1px var(--border-dark);
    background-color: var(--background-primary);
    padding: 0.1rem;
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

  @media (min-width: 500px) {
    .normal {
      left: 12.5%;
    }

    header div {
      justify-content: space-between;
    }

    header div div:nth-child(1) {
      display: flex;
    }

    @media (orientation: portrait) {
      .normal {
        width: 60%;
        height: 60%;
      }

      header {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
      }

      header div div div {
        padding: 0.4rem;
      }

      p {
        font-size: 1rem;
      }
    }
  }
</style>
