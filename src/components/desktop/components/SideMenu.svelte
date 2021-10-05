<script lang="ts">
  import dialogState from '../../../state/dialog-state';
  import FileExplorer from '../components/dialog/FileExplorer.svelte';

  type MenuItems = {
    href: string;
    src: string;
    name: string;
  };

  const menuItems: Array<MenuItems> = [
    {
      href: 'https://github.com/shanelucy/',
      src: 'build/images/github.png',
      name: 'github'
    },
    {
      href: 'https://uk.linkedin.com/in/shane-lucy-4735b616a',
      src: 'build/images/linkedin.png',
      name: 'linkedin'
    },
    {
      href: 'dialog',
      src: 'build/images/folder.png',
      name: 'explore'
    },
    {
      href: 'dialog',
      src: 'build/images/about-me.png',
      name: 'about me'
    },
    {
      href: 'dialog',
      src: 'build/images/projects.png',
      name: 'projects'
    }
  ];

  const openFileExplorer = (): void => {
    dialogState.set([
      {
        component: FileExplorer,
        openingActiveTab: 0,
        display: 'default'
      }
    ]);
  };
</script>

<aside>
  <nav>
    {#each menuItems as menuItem}
      {#if menuItem.href === 'dialog'}
        <span>
          <div class="active" />
          <a href={menuItem.href} on:click|preventDefault={openFileExplorer}>
            <img src={menuItem.src} alt={menuItem.name} />
          </a>
        </span>
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
    width: 0.75rem;
    height: 0.75rem;
    background-color: var(--active);
    border-radius: 50%;
    position: absolute;
    bottom: 0.5rem;
    left: -0.75rem;
  }
</style>
