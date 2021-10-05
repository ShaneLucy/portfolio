import { writable } from 'svelte/store';

import type FileExplorer from '../components/desktop/components/dialog/FileExplorer.svelte';

type Dialog = {
  component: typeof FileExplorer;
  openingActiveTab: 0 | 1;
  display: 'min' | 'default' | 'max';
};

export default writable<Array<Dialog>>([]);

// needs content component to render
// needs to create a copy of file explorer state
