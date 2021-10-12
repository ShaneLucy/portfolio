<script lang="ts">
  import TopMenu from './components/TopMenu.svelte';
  import SideMenu from './components/SideMenu.svelte';
  import Dialog from './components/Dialog.svelte';
  import dialogState from '../../state';
  import findActive from '../../helpers';

  const toggleActive = (): void => {
    if ($dialogState.length > 0) {
      $dialogState[findActive($dialogState)].isActive = false;
    }
  };

  const setActive = (index: number): void => {
    if (!$dialogState[index].isActive) {
      $dialogState[index].isActive = true;
    }
  };
</script>

<TopMenu />

<div on:click|self={toggleActive}>
  <SideMenu />

  {#each $dialogState as dialog, index}
    <Dialog
      on:click={() => setActive(index)}
      openingActiveTab={dialog.openingActiveTab}
      {index}
      initialFileExplorerState={dialog.fileExplorerState}
    />
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    background-image: url('images/focal-fossa.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    display: flex;
    overflow: hidden;
  }
</style>
