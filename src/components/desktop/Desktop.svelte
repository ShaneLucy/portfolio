<script lang="ts">
  import TopMenu from "./components/TopMenu.svelte";
  import SideMenu from "./components/SideMenu.svelte";
  import Dialog from "./components/Dialog.svelte";
  import { dialogState } from "../../state";
  import { setDialogAsInactive, setDialogAsActive } from "../../helpers";
</script>

<TopMenu />

<div on:click|self={setDialogAsInactive}>
  <SideMenu />

  {#each $dialogState as dialog, index (dialog.id)}
    {#if $dialogState[index].open}
      <Dialog
        on:click={(event) => setDialogAsActive(event, index)}
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
