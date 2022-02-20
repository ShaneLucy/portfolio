<script lang="ts">
  import { dialogState, totalCreatedDialogs } from "state";
  import type { Dialog } from "types";
  import Home from "src/components/desktop/components/Home.svelte";
  import AboutMe from "src/components/desktop/components/about-me/AboutMe.svelte";
  import Projects from "src/components/desktop/components/projects/Projects.svelte";

  type MenuItems = {
    href: string;
    src: string;
    name: string;
    location: "internal" | "external";
  };

  const menuItems: Array<MenuItems> = [
    {
      href: "dialog",
      src: "build/images/folder.png",
      name: "home",
      location: "internal",
    },
    {
      href: "dialog",
      src: "build/images/about-me.png",
      name: "about",
      location: "internal",
    },
    {
      href: "dialog",
      src: "build/images/projects.png",
      name: "projects",
      location: "internal",
    },
    {
      href: "https://github.com/shanelucy/",
      src: "build/images/github.png",
      name: "github",
      location: "external",
    },
    {
      href: "https://uk.linkedin.com/in/shane-lucy-4735b616a",
      src: "build/images/linkedin.png",
      name: "linkedin",
      location: "external",
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
        openingActiveTab,
        id: $totalCreatedDialogs,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
          {
            name: "about",
            active: false,
            component: AboutMe,
          },
          {
            name: "projects",
            active: false,
            component: Projects,
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
    {#each menuItems as menuItem, index}
      {#if menuItem.location === "internal"}
        <a href={menuItem.href} on:click|preventDefault={() => openFileExplorer(index)}>
          <img src={menuItem.src} alt={menuItem.name} />
        </a>
      {:else}
        <a href={menuItem.href} target="_blank" rel="noopener">
          <img src={menuItem.src} alt={menuItem.name} />
        </a>
      {/if}
    {/each}
  </nav>
</aside>

<style>
  aside {
    background-color: var(--side-menu);
    z-index: 9999;
  }

  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  img {
    height: 3.5rem;
    width: 3.5rem;
    cursor: pointer;
    object-fit: contain;
    transform: scale(0.5);
  }

  @media (min-width: 500px) {
    aside {
      height: 100%;
    }
    img {
      transform: scale(1);
    }

    nav {
      margin: 2.5rem 1.25rem;
      row-gap: 2.5rem;
      flex-direction: column;
      justify-content: start;
    }
  }
</style>
