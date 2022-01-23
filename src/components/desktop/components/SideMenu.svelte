<script lang="ts">
  import { dialogState, totalCreatedDialogs } from "../../../state";
  import type { Dialog } from "../../../types";
  import FileExplorer from "./FileExplorer.svelte";
  import Home from "./Home.svelte";
  import AboutMe from "./about-me/AboutMe.svelte";
  import Projects from "./Projects.svelte";

  type MenuItems = {
    href: string;
    src: string;
    name: string;
  };

  const externalMenuItems: Array<MenuItems> = [
    {
      href: "https://github.com/shanelucy/",
      src: "build/images/github.png",
      name: "github",
    },
    {
      href: "https://uk.linkedin.com/in/shane-lucy-4735b616a",
      src: "build/images/linkedin.png",
      name: "linkedin",
    },
  ];

  const internalMenuItems: Array<MenuItems> = [
    {
      href: "dialog",
      src: "build/images/folder.png",
      name: "home",
    },
    {
      href: "dialog",
      src: "build/images/about-me.png",
      name: "about",
    },
    {
      href: "dialog",
      src: "build/images/projects.png",
      name: "projects",
    },
  ];

  /**
   * Creates a new dialog configured as a file explorer
   * @param openingActiveTab
   */
  const openFileExplorer = (openingActiveTab: number): void => {
    if ($dialogState.length > 0) {
      const ACTIVE_INDEX = $dialogState.findIndex((x) => x.active);
      if (ACTIVE_INDEX !== -1) {
        $dialogState[ACTIVE_INDEX].active = false;
      }
    }

    const nextState: Array<Dialog> = [
      {
        component: FileExplorer,
        openingActiveTab,
        id: $totalCreatedDialogs,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
            headerWidth: 0,
            menuWidth: 0,
          },
          {
            name: "about",
            active: false,
            component: AboutMe,
            headerWidth: 0,
            menuWidth: 0,
          },
          {
            name: "projects",
            active: false,
            component: Projects,
            headerWidth: 0,
            menuWidth: 0,
          },
        ],
        active: true,
        open: true,
        title: "",
        zIndex: $totalCreatedDialogs,
      },
    ];

    dialogState.update((val) => [...val, ...nextState]);
    totalCreatedDialogs.update((value) => value + 1);
  };

  openFileExplorer(0);
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
        {#each $dialogState as dialog}
          {#if dialog.open && dialog.openingActiveTab === index}
            <span class="active" />
          {/if}
        {/each}

        <a href={menuItem.href} on:click|preventDefault={() => openFileExplorer(index)}>
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
    display: flex;
    flex-direction: column;
  }

  img {
    height: 3.5rem;
    width: 3.5rem;
    cursor: pointer;
    object-fit: contain;
    transform: scale(0.5);
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

  @media (min-width: 500px) {
    @media (orientation: portrait) {
      img {
        transform: scale(1);
      }

      nav {
        margin: 2.5rem 1.25rem;
        row-gap: 2.5rem;
      }
    }
  }
</style>
