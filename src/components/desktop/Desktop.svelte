<script lang="ts">
  import TopMenu from "./components/TopMenu.svelte";
  import SideMenu from "./components/SideMenu.svelte";
  import Dialog from "./components/Dialog.svelte";
  import { dialogState } from "../../state";

  const toggleActive = (): void => {
    if ($dialogState.length > 0) {
      const ACTIVE_INDEX = $dialogState.findIndex((x) => x.active);
      if (ACTIVE_INDEX !== -1) {
        $dialogState[ACTIVE_INDEX].active = false;
      }
    }
  };

  const setActive = (event: Event, index: number): void => {
    toggleActive();
    if ((<HTMLElement>event.target).tagName !== "IMG") {
      if (!$dialogState[index].active) {
        $dialogState[index].active = true;
      }
    }
  };
</script>

<TopMenu />

<div on:click|self={toggleActive}>
  <SideMenu />

  {#each $dialogState as dialog, index (dialog.id)}
    {#if $dialogState[index].open}
      <Dialog
        on:click={(event) => setActive(event, index)}
        openingActiveTab={dialog.openingActiveTab}
        {index}
        initialFileExplorerState={dialog.fileExplorerState}
      />
    {/if}
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    background-image: url("images/focal-fossa.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    display: flex;
    overflow: hidden;
  }
</style>
