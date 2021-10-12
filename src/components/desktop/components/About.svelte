<script lang="ts">
  import dialogState from '../../../state';
  import findActive from '../../../helpers';
  import type { Dialog } from '../../../types';
  import AboutMeTXT from './about-me/AboutMeTXT.svelte';
  import AboutMeJSON from './about-me/AboutMeJSON.svelte';
  import AboutMeYAML from './about-me/AboutMeYAML.svelte';

  const menuItems = [
    {
      name: 'about-me.txt',
      src: 'build/images/txt.png'
    },
    {
      name: 'about-me.yml',
      src: 'build/images/yaml.png'
    },
    {
      name: 'about-me.json',
      src: 'build/images/json.png'
    }
  ];

  const setComponent = (index: number): any => {
    let component;
    if (index === 0) {
      component = AboutMeTXT;
    }

    if (index === 1) {
      component = AboutMeYAML;
    }

    if (index === 2) {
      component = AboutMeJSON;
    }

    return component;
  };

  const openNewDialog = (index: number, name: string): void => {
    if (findActive($dialogState) !== -1) {
      $dialogState[findActive($dialogState)].active = false;
    }

    const nextState: Array<Dialog> = [
      {
        component: setComponent(index),
        openingActiveTab: index,
        display: 'default',
        fileExplorerState: [],
        active: true,
        open: true,
        title: name
      }
    ];

    dialogState.update((val) => [...val, ...nextState]);
  };
</script>

<nav>
  {#each menuItems as menuItem, index}
    <div on:click={() => openNewDialog(index, menuItem.name)}>
      <a href={menuItem.name} on:click|preventDefault>
        <img src={menuItem.src} alt={menuItem.name} />
      </a>
      <p>{menuItem.name}</p>
    </div>
  {/each}
</nav>

<style>
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  img {
    height: 3.5rem;
    width: 3.5rem;
    cursor: pointer;
    object-fit: contain;
  }

  div {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    cursor: pointer;
  }

  div:hover {
    background-color: var(--background-quaternary);
  }
</style>
