<script lang="ts">
  import SvgLoader from './SVGLoader.svelte';
  const menuItems = ['home', 'projects', 'about'];

  const switchTabs = (): void => {};

  const isActive = (): boolean => {
    return true;
  };
</script>

<div class="container">
  <header>
    <div>
      <div>
        <div>
          <SvgLoader svg={'chevron-left'} />

          <SvgLoader svg={'chevron-right'} />
        </div>
        <div>
          <span
            ><SvgLoader svg={'home'} />
            <p>Home</p></span
          >
        </div>
      </div>
      <div>
        <SvgLoader svg={'minimise'} />
        <SvgLoader svg={'maximise'} />
        <SvgLoader svg={'exit'} />
      </div>
    </div>
  </header>

  <div class="inner-container">
    <aside>
      <nav>
        {#each menuItems as menuItem}
          <span class:active={isActive()}>
            <SvgLoader svg={menuItem} --margin="0 0 0 0.5rem" />
            <a href={menuItem} on:click|preventDefault={switchTabs}>
              {menuItem}
            </a>
          </span>
        {/each}
      </nav>
    </aside>
    <main>
      <slot />
    </main>
  </div>
</div>

<style>
  .container {
    border: solid 1px black;
    left: 50%;
    top: 50%;
    position: absolute;
    z-index: 50;
    transform: translate(-50%, -50%);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    width: 60%;
    height: 60%;
  }

  header {
    background-color: var(--background-secondary);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: solid 1px var(--border-dark);
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  header div {
    display: flex;
    justify-content: space-between;
  }

  header div div {
    margin-right: 0.5rem;
    display: flex;
    column-gap: 0.5rem;
  }

  header div div:nth-child(2) {
    column-gap: 1.5rem;
  }

  header div div:hover {
    background-color: var(--background-secondary);
  }

  header div div div {
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    border: solid 1px var(--border-dark);
    background-color: var(--background-primary);
    display: flex;
    padding: 0.4rem;
  }

  .inner-container {
    display: flex;
    width: 100%;
    height: 100%;
  }

  a,
  .inner-container {
    color: var(--font-secondary);
  }

  aside {
    min-width: 27%;
    background-color: var(--background-quaternary);
    border-right: 1px solid var(--border-light);
  }

  nav {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }

  main {
    background-color: var(--background-tertiary);
    width: 100%;
  }

  a {
    text-decoration: none;
    text-transform: capitalize;
    font-weight: 500;
  }

  span {
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
  }

  nav span {
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  span.active {
    background-color: var(--active);
    color: var(--font-primary);
  }

  span.active a {
    color: var(--font-primary);
  }
</style>
