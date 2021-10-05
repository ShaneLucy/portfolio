<script lang="ts">
  import { onMount } from 'svelte';
  import SvgLoader from './SVGLoader.svelte';
  import About from './About.svelte';

  import Projects from './Projects.svelte';

  type MenuItems = {
    name: string;
    active: boolean;
    component: typeof Projects | About;
  };

  const menuItems: Array<MenuItems> = [
    {
      name: 'projects',
      active: false,
      component: Projects
    },
    {
      name: 'about',
      active: false,
      component: About
    }
  ];

  export let openingActiveTab: 0 | 1;
  let maximise = false;
  let minimise = false;

  const minimiseContainer = (): void => {
    minimise = !minimise;
    // Add minimised container to a store
  };

  const maximiseContainer = (): void => {
    maximise = !maximise;
  };

  const closeContainer = (): void => {
    minimise = true;
  };

  const switchTabs = (name: string): void => {
    menuItems.forEach((menuItem, index) => {
      if (menuItem.name === name) {
        menuItems[index].active = true;
      } else {
        menuItems[index].active = false;
      }
    });
  };

  const previousTab = (): void => {
    const index = menuItems.findIndex((x) => x.active === true);

    if (index > 0) {
      menuItems[index].active = false;
      menuItems[index - 1].active = true;
    }
  };

  const nextTab = (): void => {
    const index = menuItems.findIndex((x) => x.active === true);

    if (index + 1 < menuItems.length) {
      menuItems[index].active = false;
      menuItems[index + 1].active = true;
    }
  };

  onMount(() => {
    menuItems[openingActiveTab].active = true;
  });
</script>

<div
  class="container"
  class:normal={!maximise}
  class:max-container={maximise}
  class:min-container={minimise}
>
  <header class:max-header={maximise}>
    <div>
      <div>
        <div>
          <SvgLoader svg={'chevron-left'} on:click={previousTab} />

          <SvgLoader svg={'chevron-right'} on:click={nextTab} />
        </div>
        <div>
          {#each menuItems as menuItem}
            {#if menuItem.active}
              <span
                ><SvgLoader svg={menuItem.name} />
                <p>{menuItem.name}</p></span
              >
            {/if}
          {/each}
        </div>
      </div>
      <div>
        <SvgLoader svg={'minimise'} on:click={minimiseContainer} />
        <SvgLoader svg={'maximise'} on:click={maximiseContainer} />
        <SvgLoader svg={'exit'} on:click={closeContainer} />
      </div>
    </div>
  </header>

  <div class="inner-container">
    <aside>
      <nav>
        {#each menuItems as menuItem}
          <span
            class:active={menuItem.active}
            on:click={() => switchTabs(menuItem.name)}
          >
            <SvgLoader svg={menuItem.name} --margin="0 0 0 0.5rem" />
            <a href={menuItem.name} on:click|preventDefault>
              {menuItem.name}
            </a>
          </span>
        {/each}
      </nav>
    </aside>
    <div>
      <main>
        {#each menuItems as menuItem}
          {#if menuItem.active}
            <svelte:component this={menuItem.component} />
          {/if}
        {/each}
      </main>
    </div>
  </div>
</div>

<style>
  .container {
    z-index: 50;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .normal {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
  }

  .max-container {
    width: 100%;
    height: 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .max-header {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .min-container {
    display: none;
  }

  header {
    background-color: var(--background-secondary);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: solid 1px var(--border-dark);
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  p {
    text-transform: capitalize;
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

  header div div div {
    margin-left: 0.5rem;
    border-radius: 0.25rem;
    border: solid 1px var(--border-dark);
    background-color: var(--background-primary);
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
    border-bottom: 1px solid var(--border-light);
  }

  aside + div {
    background-color: var(--background-tertiary);
    width: 100%;
    height: 100%;
  }

  main {
    width: calc(100% - 1.5rem);
    height: calc(100% - 1.5rem);
    margin: 0.75rem;
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
    cursor: pointer;
  }

  nav span:hover {
    background-color: var(--border-light);
  }

  span.active {
    background-color: var(--active);
    color: var(--font-primary);
  }

  span.active:hover {
    background-color: var(--active);
  }

  span.active a {
    color: var(--font-primary);
  }
</style>
