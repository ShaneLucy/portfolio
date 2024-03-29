import type { Dialog } from "types";

import { dialogState } from "../state";
import { setDialogAsActive } from "../components/desktop/components/dialog/index";

let currentDialog: Array<Dialog>;
dialogState.subscribe(async (value) => {
  currentDialog = value;
});

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

export const toggleActiveDialog = (event: Event, index: number): void => {
  setDialogAsInactive();
  setDialogAsActive(event, index, currentDialog);
  updateDialogZIndex();
};
