import type FileExplorer from "../components/desktop/components/FileExplorer.svelte";
import type About from "../components/desktop/components/About.svelte";
import type Projects from "../components/desktop/components/Projects.svelte";
import type Home from "../components/desktop/components/Home.svelte";
import type AboutMeContent from "../components/desktop/components/dialog/AboutMeTXT.svelte";

export interface FileExplorerMenu {
  name: string;
  active: boolean;
  component: typeof Projects | About | Home;
}

export interface Dialog {
  component: typeof FileExplorer | AboutMeContent;
  openingActiveTab: number;
  display: "min" | "default" | "max";
  fileExplorerState: Array<FileExplorerMenu> | [];
  active: boolean;
  open: boolean;
  title: string;
  id: number;
}
