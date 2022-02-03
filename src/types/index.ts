import type FileExplorer from "../components/desktop/components/FileExplorer.svelte";
import type AboutMe from "../components/desktop/components/about-me/AboutMe.svelte";
import type Projects from "../components/desktop/components/projects/Projects.svelte";
import type Home from "../components/desktop/components/Home.svelte";

export type FileExplorerMenu = {
  name: "home" | "about" | "projects";
  active: boolean;
  component: typeof Projects | AboutMe | Home;
};

export type Dialog = {
  component: typeof FileExplorer;
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
