<script lang="ts">
  import TopMenu from "./components/TopMenu.svelte";
  import SideMenu from "./components/SideMenu.svelte";
  import Dialog from "./components/dialog/Dialog.svelte";
  import { dialogState } from "../../state";
  import { setDialogAsInactive, toggleActiveDialog } from "../../helpers";
</script>

<div class="container">
  <TopMenu />

  <div class="desktop" on:click|self={setDialogAsInactive}>
    <SideMenu />
    {#each $dialogState as dialog, index (dialog.id)}
      {#if $dialogState[index].open}
        <Dialog
          on:click={(event) => toggleActiveDialog(event, index)}
          openingActiveTab={dialog.openingActiveTab}
          {index}
          initialFileExplorerState={dialog.fileExplorerState}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
  .container {
    display: flex;
    flex-direction: column;
  }
  .desktop {
    background-image: url("images/focal-fossa.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    overflow: hidden;
  }

  @media (min-width: 500px) {
    .desktop {
      flex-direction: row;
    }
  }
</style>
