<script lang="ts">
  import type { ProjectProperties } from "../../../../types";
  import SVGLoader from "../../SVGLoader.svelte";

  export let project: ProjectProperties;
</script>

<article>
  <header>
    <img src={project.thumbnail} alt="" />
    <h2>{project.name}</h2>
  </header>
  <div>
    <p>{project.description}</p>
    <footer>
      {#if project.websiteUrl.length > 0}
        <a href={project.websiteUrl} target="_blank" rel="noopener"
          >Website <SVGLoader svg={"externalLink"} /></a
        >
      {/if}

      {#if project.githubUrl.length > 0}
        <a href={project.githubUrl} target="_blank" rel="noopener"
          >Github <SVGLoader svg={"externalLink"} /></a
        >
      {/if}
    </footer>
  </div>
</article>

<style>
  article {
    margin: 0.75rem;
    padding: 0.75rem;
    height: max-content;
    width: 28%;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  article:hover {
    background-color: #f9f9f9f3;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1.25rem;
  }

  div {
    margin-top: 0.75rem;
  }

  footer {
    display: flex;
    margin-top: 1rem;
    justify-content: space-between;
    font-size: 1.05rem;
    position: relative;
  }
</style>
