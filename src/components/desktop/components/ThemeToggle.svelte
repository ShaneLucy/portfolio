<script lang="ts">
  import { onMount } from "svelte";
  import SvgLoader from "../SVGLoader.svelte";

  let darkMode: boolean;

  const setDarkTheme = (): void => {
    document.body.classList.remove("light-theme");
    document.body.classList.toggle("dark-theme");
    window.localStorage.setItem("darkMode", "true");
    darkMode = true;
  };

  const setLightTheme = (): void => {
    document.body.classList.remove("dark-theme");
    document.body.classList.toggle("light-theme");
    window.localStorage.setItem("darkMode", "false");
    darkMode = false;
  };

  onMount(() => {
    if (JSON.parse(window.localStorage.getItem("darkMode")!)) {
      setDarkTheme();
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  });
</script>

{#if darkMode}
  <SvgLoader on:click={setLightTheme} svg={"sun"} />
{:else}
  <SvgLoader on:click={setDarkTheme} svg={"moon"} />
{/if}
