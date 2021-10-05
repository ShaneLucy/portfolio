<script lang="ts">
  const menuItems = [
    {
      name: 'about-me.txt',
      src: 'build/images/txt.png'
    },
    {
      name: 'about-me.json',
      src: 'build/images/json.png'
    }
  ];

  const openNewDialog = (): void => {
    // do something
  };
</script>

<nav>
  {#each menuItems as menuItem}
    <div>
      <a href={menuItem.name} on:click|preventDefault={openNewDialog}>
        <img src={menuItem.src} alt={menuItem.name} />
      </a>
      <p>{menuItem.name}</p>
    </div>
  {/each}
</nav>

<style>
  nav {
    display: flex;
    column-gap: 1rem;
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
