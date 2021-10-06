import { writable } from 'svelte/store';
import type { Dialog } from '../types';

export default writable<Array<Dialog>>([]);
