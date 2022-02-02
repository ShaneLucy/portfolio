<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { draggable } from "@neodrag/svelte";
  import type { FileExplorerMenu } from "../../../types";
  import { dialogState } from "../../../state";
  import SvgLoader from "../SVGLoader.svelte";
  import { setDialogAsActive } from "../../../helpers";

  export let openingActiveTab: number;
  export let index: number;
  export let initialFileExplorerState: Array<FileExplorerMenu>;

  const fileExplorerState = writable<Array<FileExplorerMenu>>(initialFileExplorerState);

  let header: HTMLElement;
  $fileExplorerState[openingActiveTab].active = true;

  const closeDialog = (event: Event): void => {
    event.stopPropagation();
    setDialogAsActive(event, index);

    if ($dialogState.length > 0) {
      dialogState.update((value) => {
        value.splice(index, 1);
        return value;
      });
    }
  };

  const getCurrentIndex = (menu: Array<FileExplorerMenu>): number =>
    menu.findIndex((x) => x.active === true);

  const previousTab = (): void => {
    const currentIndex = getCurrentIndex($fileExplorerState);

    if (currentIndex > 0) {
      $fileExplorerState[currentIndex].active = false;
      $fileExplorerState[currentIndex - 1].active = true;
    }
  };

  const nextTab = (): void => {
    const currentIndex = getCurrentIndex($fileExplorerState);

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
    $fileExplorerState.forEach((fileExplorer, i) => {
      $fileExplorerState[i].headerWidth = header.offsetWidth;
    });
  });
</script>

<div
  use:draggable={{ handle: "header" }}
  class="container"
  style="z-index: {$dialogState[index].zIndex};"
  on:click
>
  <header class:active={$dialogState[index].active} bind:this={header}>
    <div>
      <div>
        <SvgLoader svg={"chevron-left"} on:click={previousTab} />
        <SvgLoader svg={"chevron-right"} on:click={nextTab} />
      </div>
      {#each $fileExplorerState as menuItem}
        {#if menuItem.active}
          <div>
            <span
              ><SvgLoader svg={menuItem.name} />
              <p>{menuItem.name}</p></span
            >
          </div>
        {/if}
      {/each}
    </div>
    <div>
      <div>
        <SvgLoader svg={"exit"} on:click={(event) => closeDialog(event)} />
      </div>
    </div>
  </header>
  <div class="inner-container">
    {#each $dialogState as dialog, dialogIndex}
      {#if index === dialogIndex}
        <svelte:component
          this={dialog.component}
          fileExplorerState={$fileExplorerState}
          on:update-active-tab={setActiveTab}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .container {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    width: 90%;
    margin-left: 5%;
    height: 80%;
    top: 2%;
    position: absolute;
  }

  header {
    background-color: var(--background-primary);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: solid 1px var(--border-dark);
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
    width: 100%;
    cursor: grab;
    display: flex;
    justify-content: space-between;
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
    margin-right: 0.25rem;
    margin-left: 0.25rem;
    padding: 0.1rem;
  }
  header div div {
    border-radius: 0.25rem;
    border: solid 1px var(--border-dark);
    background-color: var(--background-primary);
  }

  .inner-container {
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    height: 100%;
    color: var(--font-secondary);
    background-color: var(--background-tertiary);
  }

  span {
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
  }

  @media (min-width: 500px) {
    .container {
      width: 75%;
      height: 75%;
      left: 20%;
      margin-left: 0;
      top: 0;
    }

    .inner-container {
      flex-direction: row;
    }
    header div {
      justify-content: space-between;
    }

    header div div:nth-child(1) {
      display: flex;
    }

    header {
      padding-top: 0.125rem;
      padding-bottom: 0.125rem;
    }

    header div div div {
      padding: 0.2rem;
    }

    p {
      font-size: 1rem;
    }
  }
</style>
