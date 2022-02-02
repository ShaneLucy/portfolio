<script lang="ts">
  export let svg: string;
</script>

{#if svg === "home"}
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    /></svg
  >
{/if}

{#if svg === "projects"}
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    /></svg
  >
{/if}

{#if svg === "about"}
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    /></svg
  >
{/if}

{#if svg === "chevron-left"}
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    on:click
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 19l-7-7 7-7"
    /></svg
  >
{/if}

{#if svg === "chevron-right"}
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    on:click
    xmlns="http://www.w3.org/2000/svg"
    ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg
  >
{/if}

{#if svg === "exit"}
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    on:click
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    /></svg
  >
{/if}

{#if svg === "maximise"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    fill-rule="evenodd"
    clip-rule="evenodd"
    on:click
    viewBox="0 0 24 24"
    ><path
      d="M24 22h-24v-20h24v20zm-7-1v-15h-16v15h16zm1 0h5v-18h-22v2h17v16zm-6-6h-1v-3.241l-7.241 7.241-.759-.759 7.241-7.241h-3.241v-1h5v5z"
    /></svg
  >
{/if}

{#if svg === "minimise"}
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    on:click
    ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg
  >
{/if}

{#if svg === "externalLink"}
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    /></svg
  >
{/if}

{#if svg === "moon"}
  <svg
    fill="none"
    on:click
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    /></svg
  >
{/if}

{#if svg === "sun"}
  <svg
    fill="none"
    on:click
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    /></svg
  >
{/if}

<style>
  svg {
    width: 1.25rem;
    height: auto;
    cursor: pointer;
  }

  @media (min-width: 500px) {
    svg {
      margin: var(--margin);
    }
  }
</style>
