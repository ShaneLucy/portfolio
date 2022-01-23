<script lang="ts">
  import type { ProjectProperties } from "../../../../types";
  import Card from "./Card.svelte";

  const projects: Array<ProjectProperties> = [
    {
      name: "Project Boilerplate Setup",
      description: "A tool which automates the boring setup at the beginning of a project",
      thumbnail: "build/images/github.png",
      githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
      websiteUrl: "fgfgdfg",
    },
    {
      name: "Project Boilerplate Setup",
      description: "A tool which automates the boring setup at the beginning of a project",
      thumbnail: "build/images/github.png",
      githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
      websiteUrl: "",
    },
    {
      name: "Project Boilerplate Setup",
      description: "A tool which automates the boring setup at the beginning of a project",
      thumbnail: "build/images/github.png",
      githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
      websiteUrl: "",
    },

    {
      name: "Project Boilerplate Setup",
      description: "A tool which automates the boring setup at the beginning of a project",
      thumbnail: "build/images/github.png",
      githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
      websiteUrl: "",
    },
    // {
    //   name: "Project Boilerplate Setup",
    //   description: "A tool which automates the boring setup at the beginning of a project",
    //   thumbnail: "build/images/github.png",
    //   githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
    //   websiteUrl: "",
    // },

    // {
    //   name: "Project Boilerplate Setup",
    //   description: "A tool which automates the boring setup at the beginning of a project",
    //   thumbnail: "build/images/github.png",
    //   githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
    //   websiteUrl: "",
    // },
    // {
    //   name: "Project Boilerplate Setup",
    //   description: "A tool which automates the boring setup at the beginning of a project",
    //   thumbnail: "build/images/github.png",
    //   githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
    //   websiteUrl: "",
    // },

    // {
    //   name: "Project Boilerplate Setup",
    //   description: "A tool which automates the boring setup at the beginning of a project",
    //   thumbnail: "build/images/github.png",
    //   githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
    //   websiteUrl: "",
    // },
    // {
    //   name: "Project Boilerplate Setup",
    //   description: "A tool which automates the boring setup at the beginning of a project",
    //   thumbnail: "build/images/github.png",
    //   githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
    //   websiteUrl: "",
    // },

    // {
    //   name: "Project Boilerplate Setup",
    //   description: "A tool which automates the boring setup at the beginning of a project",
    //   thumbnail: "build/images/github.png",
    //   githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
    //   websiteUrl: "",
    // },
    // {
    //   name: "Project Boilerplate Setup",
    //   description: "A tool which automates the boring setup at the beginning of a project",
    //   thumbnail: "build/images/github.png",
    //   githubUrl: "https://github.com/ShaneLucy/project-boilerplate-setup",
    //   websiteUrl: "",
    // },
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
  }
</style>
