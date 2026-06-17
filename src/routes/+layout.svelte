<script lang="ts">
  import '$lib/styles/tokens.css';
  import '$lib/styles/reset.css';
  import '$lib/styles/global.css';
  import SkipLink from '$lib/a11y/SkipLink.svelte';
  import MotionToggle from '$lib/a11y/MotionToggle.svelte';
  import NavBar from '$lib/nav/NavBar.svelte';
  import ShaderCanvas from '$lib/shader/ShaderCanvas.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Shane Lucy — Full-stack Developer</title>
  <meta name="description" content="Full-stack developer building interfaces that earn a second look." />
</svelte:head>

<ShaderCanvas />
<SkipLink />
<NavBar />
<main id="main-content">
  {@render children()}
</main>
<MotionToggle />
