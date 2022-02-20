import type AboutMe from "src/components/desktop/components/dialog/components/file-explorer/components/about-me/AboutMe.svelte";
import type Projects from "src/components/desktop/components/dialog/components/file-explorer/components/projects/Projects.svelte";
import type Home from "src/components/desktop/components/dialog/components/file-explorer/components/Home.svelte";

export type FileExplorerMenu = {
  name: "home" | "about" | "projects";
  active: boolean;
  component: typeof Projects | AboutMe | Home;
};

export type Dialog = {
  openingActiveTab: number;
  display: "min" | "default" | "max";
  fileExplorerState: Array<FileExplorerMenu> | [];
  active: boolean;
  open: boolean;
  title: string;
  id: number;
  zIndex: number;
};

export type ProjectProperties = {
  name: string;
  description: string;
  thumbnail: string;
  githubUrl: string;
  websiteUrl: string;
};
