import type FileExplorer from "../components/desktop/components/FileExplorer.svelte";
import type AboutMe from "../components/desktop/components/about-me/AboutMe.svelte";
import type Projects from "../components/desktop/components/Projects.svelte";
import type Home from "../components/desktop/components/Home.svelte";

export interface FileExplorerMenu {
  name: string;
  active: boolean;
  component: typeof Projects | AboutMe | Home;
  headerWidth: number;
  menuWidth: number;
}

export interface Dialog {
  component: typeof FileExplorer;
  openingActiveTab: number;
  display: "min" | "default" | "max";
  fileExplorerState: Array<FileExplorerMenu> | [];
  active: boolean;
  open: boolean;
  title: string;
  id: number;
  zIndex: number;
}
