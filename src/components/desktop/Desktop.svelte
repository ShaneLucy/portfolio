<script lang="ts">
  import TopMenu from './components/TopMenu.svelte';
  import SideMenu from './components/SideMenu.svelte';
  import Dialog from './components/Dialog.svelte';
  import dialogState from '../../state';
</script>

<TopMenu />

<div class="desktop">
  <SideMenu />

  {#each $dialogState as dialog, index}
    <Dialog
      openingActiveTab={dialog.openingActiveTab}
      {index}
      initialFileExplorerState={dialog.fileExplorerState}
    />
  {/each}
</div>

<style>
  .desktop {
    width: 100%;
    height: 100%;
    background-image: url('images/focal-fossa.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    display: flex;
  }
</style>
