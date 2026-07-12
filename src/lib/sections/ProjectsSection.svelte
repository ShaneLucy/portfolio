<script lang="ts">
  import ProjectCard from "$lib/projects/ProjectCard.svelte";

  const projects = [
    {
      id: "db-documenter",
      title: "db-documenter",
      hook: "One command. Living schema diagrams.",
      tech: ["Java", "PostgreSQL", "PlantUML", "JDBC"] as const,
      narrative:
        "db-documenter is a Java library that connects to a live PostgreSQL database and automatically generates PlantUML entity-relationship diagrams reflecting the current schema. No manual diagram maintenance, no drift between documentation and reality. Point it at any database, run a single command, get a diagram. Built to solve the problem of schema documentation that rots the moment it's written."
    },
    {
      id: "blog",
      title: "Travel Blog",
      hook: "Stories from the road, built from scratch.",
      tech: ["SvelteKit", "TypeScript", "Markdown"] as const,
      narrative:
        "A personal travel blog built with SvelteKit and TypeScript. Markdown-driven content, fast static generation, and a clean typographic system designed for long-form reading. The project served as a playground for learning SvelteKit before applying it to more complex work."
    }
  ] as const;
</script>

<section id="projects" aria-labelledby="projects-heading">
  <div class="container">
    <h2 id="projects-heading" class="section-heading">Projects</h2>
    <div class="projects-grid">
      {#each projects as project (project.id)}
        <ProjectCard {project}>
          {#snippet links()}
            {#if project.id === "db-documenter"}
              <a
                href="https://github.com/shanelucy/db-documenter"
                class="card-link type-label"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="db-documenter on GitHub (opens in a new tab)"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            {:else if project.id === "blog"}
              <a
                href="https://github.com/shanelucy/blog"
                class="card-link type-label"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Travel Blog on GitHub (opens in a new tab)"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            {/if}
          {/snippet}
        </ProjectCard>
      {/each}
    </div>
  </div>
</section>

<style>
  section {
    padding-top: calc(var(--section-padding-y) + 4rem);
  }

  .section-heading {
    margin-bottom: var(--space-12);
    font-size: var(--text-2xl);
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr));
    gap: var(--space-6);
  }

  .card-link {
    color: var(--cool-bright);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    padding-bottom: 1px;
    transition: border-color var(--transition-fast);
  }

  .card-link:hover {
    border-color: var(--cool-bright);
  }
</style>
