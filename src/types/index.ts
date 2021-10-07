import type FileExplorer from '../components/desktop/components/dialog/FileExplorer.svelte';
import type About from '../components/desktop/components/About.svelte';
import type Projects from '../components/desktop/components/Projects.svelte';
import type Home from '../components/desktop/components/Home.svelte';

export interface FileExplorerMenu {
  name: string;
  active: boolean;
  component: typeof Projects | About | Home;
}

export interface Dialog {
  component: typeof FileExplorer;
  openingActiveTab: number;
  display: 'min' | 'default' | 'max';
  fileExplorerState: Array<FileExplorerMenu>;
  isActive: boolean;
  isOpen: true;
}
