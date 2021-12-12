import { writable } from 'svelte/store';
import type { Dialog } from '../types';

export const dialogState = writable<Array<Dialog>>([]);
export const totalCreatedDialogs = writable<number>(0);
