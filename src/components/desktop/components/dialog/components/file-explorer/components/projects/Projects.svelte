<script lang="ts">
  import type { ProjectProperties } from "types";
  import Card from "src/components/desktop/components/dialog/components/file-explorer/components/projects/components/Card.svelte";

  const projects: Array<ProjectProperties> = [
    {
      name: "HTTP Security Headers",
      description:
        "A serverless function ran on cloudflare workers that intercepts incoming requests and sets various security headers",
      thumbnail: "build/images/github.png",
      githubUrl: "https://github.com/ShaneLucy/http-security-headers",
      websiteUrl: "",
    },
    {
      name: "Eslint Config TypeScript",
      description:
        "A package that integrates Airbnb's eslint config, typescript, prettier & eslint import into a single package for convenient installation",
      thumbnail: "build/images/github.png",
      githubUrl: "https://github.com/ShaneLucy/eslint-config-typescript",
      websiteUrl: "",
    },

    {
      name: "Project Boilerplate Setup",
      description: "A tool which automates the boring setup at the beginning of a project",
      thumbnail: "build/images/github.png",
      githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
      websiteUrl: "",
    },
  ];
</script>

<div>
  {#each projects as project}
    <Card {project} />
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
