import { dialogState } from "../state";
import type { Dialog, FileExplorerMenu } from "../types";

let currentDialog: Array<Dialog>;
dialogState.subscribe(async (value) => {
  currentDialog = value;
});

export const getFileExplorerActiveIndex = (menu: Array<FileExplorerMenu>): number =>
  menu.findIndex((x) => x.active === true);

export const setDialogAsInactive = (): void => {
  if (currentDialog.length > 0) {
    const ACTIVE_INDEX = currentDialog.findIndex((x) => x.active);
    if (ACTIVE_INDEX !== -1) {
      currentDialog[ACTIVE_INDEX].active = false;
    }
  }
};

export const updateDialogZIndex = (): void => {
  if (currentDialog.length > 0) {
    currentDialog.forEach((dialog, index) => {
      if (dialog.active) {
        currentDialog[index].zIndex = currentDialog.length;
        currentDialog[index].zIndex += 1;
      } else {
        currentDialog[index].zIndex = currentDialog[index].id;
      }
    });
  }
};

export const setDialogAsActive = (event: Event, index: number): void => {
  if ((<HTMLElement>event.target).tagName !== "IMG" && !currentDialog[index].active) {
    currentDialog[index].active = true;
  }
  dialogState.set(currentDialog);
};

export const toggleActiveDialog = (event: Event, index: number): void => {
  setDialogAsInactive();
  setDialogAsActive(event, index);
  updateDialogZIndex();
};
