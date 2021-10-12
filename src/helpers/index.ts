import type { Dialog } from '../types';

/**
 * Returns the index of the active dialog
 */
export default (dialog: Array<Dialog>): number => {
  const activeIndex = dialog.findIndex((x) => x.isActive);
  return activeIndex;
};
