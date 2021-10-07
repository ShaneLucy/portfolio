<script lang="ts">
  import dialogState from '../../../state';
  import type { Dialog } from '../../../types';
  import findActive from '../../../helpers';
  import FileExplorer from '../components/dialog/FileExplorer.svelte';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import Projects from './Projects.svelte';

  type MenuItems = {
    href: string;
    src: string;
    name: string;
  };

  const externalMenuItems: Array<MenuItems> = [
    {
      href: 'https://github.com/shanelucy/',
      src: 'build/images/github.png',
      name: 'github'
    },
    {
      href: 'https://uk.linkedin.com/in/shane-lucy-4735b616a',
      src: 'build/images/linkedin.png',
      name: 'linkedin'
    }
  ];

  const internalMenuItems: Array<MenuItems> = [
    {
      href: 'dialog',
      src: 'build/images/folder.png',
      name: 'home'
    },
    {
      href: 'dialog',
      src: 'build/images/about-me.png',
      name: 'about'
    },
    {
      href: 'dialog',
      src: 'build/images/projects.png',
      name: 'projects'
    }
  ];

  /**
   * Creates a new dialog configured as a file explorer
   * @param openingActiveTab
   */
  const openFileExplorer = (openingActiveTab: number): void => {
    if ($dialogState.length > 0) {
      $dialogState[findActive($dialogState)].isActive = false;
    }

    const nextState: Array<Dialog> = [
      {
        component: FileExplorer,
        openingActiveTab,
        display: 'default',
        fileExplorerState: [
          {
            name: 'home',
            active: false,
            component: Home
          },
          {
            name: 'about',
            active: false,
            component: About
          },
          {
            name: 'projects',
            active: false,
            component: Projects
          }
        ],
        isActive: true,
        isOpen: true
      }
    ];

    dialogState.update((val) => [...val, ...nextState]);
  };
</script>

<aside>
  <nav>
    {#each externalMenuItems as menuItem}
      <a href={menuItem.href} target="_blank" rel="noopener">
        <img src={menuItem.src} alt={menuItem.name} />
      </a>
    {/each}

    {#each internalMenuItems as menuItem, index}
      <span>
        {#each $dialogState as dialog, idx}
          {#if dialog.isOpen && dialog.openingActiveTab === index}
            <span class="active" />
          {/if}
        {/each}

        <a
          href={menuItem.href}
          on:click|preventDefault={() => openFileExplorer(index)}
        >
          <img src={menuItem.src} alt={menuItem.name} />
        </a>
      </span>
    {/each}
  </nav>
</aside>

<style>
  aside {
    height: 100%;
    background-color: var(--side-menu);
    z-index: 9999;
  }

  nav {
    margin: 2.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    row-gap: 2.5rem;
  }

  img {
    height: 3.5rem;
    width: 3.5rem;
    cursor: pointer;
    object-fit: contain;
  }

  span {
    position: relative;
  }

  .active {
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--active);
    border-radius: 50%;
    position: absolute;
    bottom: 0.5rem;
    left: -0.75rem;
  }
</style>
