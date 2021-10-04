<script lang="ts">
  import TopMenu from './components/TopMenu.svelte';
  import SideMenu from './components/SideMenu.svelte';
  import Dialog from './components/Dialog.svelte';
</script>

<TopMenu />

<div class="desktop">
  <SideMenu />

  <Dialog />
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
