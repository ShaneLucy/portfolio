import type { FileExplorerMenu, Dialog } from "types";

export const closeDialog = (dialogState: Array<Dialog>, index: number): Array<Dialog> => {
  const DIALOG_CLONE = [...dialogState];
  if (DIALOG_CLONE.length > 0) {
    DIALOG_CLONE.splice(index, 1);
  }

  return DIALOG_CLONE;
};

export const getFileExplorerActiveIndex = (menu: Array<FileExplorerMenu>): number =>
  menu.findIndex((x) => x.active === true);

export const setPreviousTabAsActive = (menu: Array<FileExplorerMenu>): Array<FileExplorerMenu> => {
  const CURRENT_INDEX = getFileExplorerActiveIndex(menu);
  const MENU_COPY = [...menu];

  if (CURRENT_INDEX > 0) {
    MENU_COPY[CURRENT_INDEX].active = false;
    MENU_COPY[CURRENT_INDEX - 1].active = true;
  }

  return MENU_COPY;
};

export const setNextTabAsActive = (menu: Array<FileExplorerMenu>): Array<FileExplorerMenu> => {
  const CURRENT_INDEX = getFileExplorerActiveIndex(menu);
  const MENU_COPY = [...menu];
  if (CURRENT_INDEX + 1 < menu.length) {
    MENU_COPY[CURRENT_INDEX].active = false;
    MENU_COPY[CURRENT_INDEX + 1].active = true;
  }

  return MENU_COPY;
};

export const setActiveTab = (
  event: Event,
  menu: Array<FileExplorerMenu>
): Array<FileExplorerMenu> => {
  const MENU_COPY = [...menu];
  MENU_COPY.forEach((fileExplorerMenu, i) => {
    MENU_COPY[i].active = false;
  });
  MENU_COPY[(<CustomEvent>event).detail.index].active = true;
  return MENU_COPY;
};
