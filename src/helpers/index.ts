import { dialogState } from "../state";
import type { Dialog } from "../types";

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

export const setDialogAsActive = (event: Event, index: number): void => {
  setDialogAsInactive();
  if ((<HTMLElement>event.target).tagName !== "IMG" && !currentDialog[index].active) {
    currentDialog[index].active = true;
  }
  dialogState.set(currentDialog);
};
