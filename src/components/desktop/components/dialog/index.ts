import type { Dialog } from "types";

export const closeDialog = (dialogState: Array<Dialog>, index: number): Array<Dialog> => {
  const DIALOG_CLONE = [...dialogState];
  if (DIALOG_CLONE.length > 0) {
    DIALOG_CLONE.splice(index, 1);
  }

  return DIALOG_CLONE;
};

export const setDialogAsActive = (
  event: Event,
  index: number,
  dialogState: Array<Dialog>
): Array<Dialog> => {
  const DIALOG_COPY = [...dialogState];
  if ((<HTMLElement>event.target).tagName !== "IMG" && !DIALOG_COPY[index].active) {
    DIALOG_COPY[index].active = true;
  }
  return DIALOG_COPY;
};
