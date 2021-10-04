<script lang="ts">
  import TopMenu from './components/TopMenu.svelte';
  import SideMenu from './components/SideMenu.svelte';
</script>

<TopMenu />

<div>
  <SideMenu />
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    background-image: url('images/focal-fossa.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
