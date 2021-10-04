<script lang="ts">
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
      name: 'about me'
    }
  ];

  const openFileExplorer = (): void => {
    
  }
</script>

<aside>
  <nav>
    {#each menuItems as menuItem}
    {#if menuItem.href === 'dialog'}
    <a href={menuItem.href} on:click|preventDefault={openFileExplorer} >
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
    height: 100%;
    width: max-content;
    top: 1.95rem;
    left: 0;
    background-color: var(--side-menu);
    overflow: hidden;
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
</style>
