import { writable } from 'svelte/store';
import About from '../components/desktop/components/About.svelte';
import Projects from '../components/desktop/components/Projects.svelte';

type FileExplorerMenu = {
  name: string;
  active: boolean;
  component: typeof Projects | About;
};

export default writable<Array<FileExplorerMenu>>([
  {
    name: 'projects',
    active: false,
    component: Projects
  },
  {
    name: 'about',
    active: false,
    component: About
  }
]);
