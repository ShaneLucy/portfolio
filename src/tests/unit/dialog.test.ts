import type { Dialog } from "types";
import { closeDialog, setDialogAsActive } from "../../components/desktop/components/dialog";
import Home from "../../components/desktop/components/dialog/components/file-explorer/components/Home.svelte";

describe("the dialog utilities work correctly", () => {
  test("if there are multiple open dialogs the correct dialog is closed", () => {
    const DIALOG: Array<Dialog> = [
      {
        openingActiveTab: 0,
        id: 0,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
        ],
        active: false,
        open: false,
        title: "",
        zIndex: 0,
      },
      {
        openingActiveTab: 1,
        id: 1,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
        ],
        active: true,
        open: true,
        title: "",
        zIndex: 1,
      },
    ];

    const DIALOG_AFTER_CLOSE_DIALOG_EVENT = closeDialog(DIALOG, 0);

    expect(DIALOG_AFTER_CLOSE_DIALOG_EVENT).toHaveLength(1);
    expect(DIALOG_AFTER_CLOSE_DIALOG_EVENT[0].openingActiveTab).toEqual(1);
  });

  test("if there is only one open dialog it is closed", () => {
    const DIALOG: Array<Dialog> = [
      {
        openingActiveTab: 0,
        id: 0,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
        ],
        active: false,
        open: false,
        title: "",
        zIndex: 0,
      },
    ];
    const DIALOG_AFTER_CLOSE_DIALOG_EVENT = closeDialog(DIALOG, 0);

    expect(DIALOG_AFTER_CLOSE_DIALOG_EVENT).toHaveLength(0);
  });

  test("if the click target is a IMG then the dialog should not be set as active", () => {
    const DIALOG: Array<Dialog> = [
      {
        openingActiveTab: 0,
        id: 0,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
        ],
        active: false,
        open: false,
        title: "",
        zIndex: 0,
      },
      {
        openingActiveTab: 1,
        id: 1,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
        ],
        active: false,
        open: false,
        title: "",
        zIndex: 1,
      },
    ];

    const EVENT = new Event("click");

    Object.defineProperty(EVENT, "target", { writable: true, value: { tagName: {} } });
    Object.defineProperty(<HTMLElement>EVENT.target, "tagName", {
      writable: true,
      value: "IMG",
    });

    const DIALOG_AFTER_SET_ACTIVE_DIALOG_EVENT = setDialogAsActive(EVENT, 0, DIALOG);
    expect(DIALOG_AFTER_SET_ACTIVE_DIALOG_EVENT[0].active).toBeFalsy();
    expect(DIALOG_AFTER_SET_ACTIVE_DIALOG_EVENT[0].active).toBeFalsy();
  });

  test("the correct dialog is set as active", () => {
    const DIALOG: Array<Dialog> = [
      {
        openingActiveTab: 0,
        id: 0,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
        ],
        active: false,
        open: false,
        title: "",
        zIndex: 0,
      },
      {
        openingActiveTab: 1,
        id: 1,
        display: "default",
        fileExplorerState: [
          {
            name: "home",
            active: false,
            component: Home,
          },
        ],
        active: false,
        open: false,
        title: "",
        zIndex: 1,
      },
    ];

    const EVENT = new Event("click");

    Object.defineProperty(EVENT, "target", { writable: true, value: { tagName: {} } });
    Object.defineProperty(<HTMLElement>EVENT.target, "tagName", {
      writable: true,
      value: "DIV",
    });

    const DIALOG_AFTER_SET_ACTIVE_DIALOG_EVENT = setDialogAsActive(EVENT, 0, DIALOG);

    expect(DIALOG_AFTER_SET_ACTIVE_DIALOG_EVENT[0].active).toBeTruthy();
    expect(DIALOG_AFTER_SET_ACTIVE_DIALOG_EVENT[1].active).toBeFalsy();
  });
});
