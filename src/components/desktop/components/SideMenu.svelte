<script lang="ts">
  const menuItems = [
    {
      href: 'https://github.com/shanelucy/',
      src: 'assets/github.png'
    }
  ];
</script>

<aside>
  <nav>
    {#each menuItems as menuItem}
      <a href={menuItem.href} target="_blank" rel="noopener">
        <img src={menuItem.src} alt="" />
      </a>
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
    margin: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
  }

  img {
    height: auto;
    width: 3.5rem;
    cursor: pointer;
  }
</style>
