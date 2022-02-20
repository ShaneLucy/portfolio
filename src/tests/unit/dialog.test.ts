import type { FileExplorerMenu, Dialog } from "types";
import {
  setNextTabAsActive,
  setPreviousTabAsActive,
  setActiveTab,
  closeDialog,
  getFileExplorerActiveIndex,
} from "../../components/desktop/components/dialog";
import Home from "../../components/desktop/components/Home.svelte";

describe("getFileExplorerActiveIndex returns the correct value", () => {
  test("given a file explorer menu with an active tab it returns the correct index", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: true,
        component: Home,
      },
    ];
    expect(getFileExplorerActiveIndex(FILE_EXPLORER_STATE)).toEqual(0);
  });

  test("given a file explorer menu without an active tab it returns the correct index", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: false,
        component: Home,
      },
    ];
    expect(getFileExplorerActiveIndex(FILE_EXPLORER_STATE)).toEqual(-1);
  });

  test("given a file explorer menu with multiple active tabs, it returns the first index", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: true,
        component: Home,
      },
      {
        name: "home",
        active: true,
        component: Home,
      },
      {
        name: "home",
        active: true,
        component: Home,
      },
    ];
    expect(getFileExplorerActiveIndex(FILE_EXPLORER_STATE)).toEqual(0);
  });
});

describe("dialog utility functions work correctly", () => {
  test("set next tab as active navigates to the next tab if the current active tab is not the last index in the array", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: true,
        component: Home,
      },
      {
        name: "home",
        active: false,
        component: Home,
      },
    ];

    const FILE_EXPLORER_STATE_AFTER_NAVIGATION = setNextTabAsActive(FILE_EXPLORER_STATE);

    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[0].active).toBeFalsy();
    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[1].active).toBeTruthy();
  });

  test("set next tab as active does nothing if the current active tab is the last index in the array", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: false,
        component: Home,
      },
      {
        name: "home",
        active: true,
        component: Home,
      },
    ];

    const FILE_EXPLORER_STATE_AFTER_NAVIGATION = setNextTabAsActive(FILE_EXPLORER_STATE);

    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[0].active).toBeFalsy();
    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[1].active).toBeTruthy();
  });

  test("set previous tab as active navigates to the previous tab if the current active tab is not the first index in the array", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: false,
        component: Home,
      },
      {
        name: "home",
        active: true,
        component: Home,
      },
    ];

    const FILE_EXPLORER_STATE_AFTER_NAVIGATION = setPreviousTabAsActive(FILE_EXPLORER_STATE);

    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[0].active).toBeTruthy();
    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[1].active).toBeFalsy();
  });

  test("set previous tab as active does nothing if the current active tab is the first index in the array", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: true,
        component: Home,
      },
      {
        name: "home",
        active: false,
        component: Home,
      },
    ];

    const FILE_EXPLORER_STATE_AFTER_NAVIGATION = setPreviousTabAsActive(FILE_EXPLORER_STATE);

    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[0].active).toBeTruthy();
    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[1].active).toBeFalsy();
  });

  test("set active tab sets any active tabs as in active and sets the correct tab as active", () => {
    const FILE_EXPLORER_STATE: Array<FileExplorerMenu> = [
      {
        name: "home",
        active: true,
        component: Home,
      },
      {
        name: "home",
        active: false,
        component: Home,
      },
      {
        name: "home",
        active: false,
        component: Home,
      },
      {
        name: "home",
        active: false,
        component: Home,
      },
    ];

    const CLICK_EVENT = new CustomEvent("click", {
      detail: {
        index: 3,
      },
    });
    const FILE_EXPLORER_STATE_AFTER_NAVIGATION = setActiveTab(CLICK_EVENT, FILE_EXPLORER_STATE);

    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[0].active).toBeFalsy();
    expect(FILE_EXPLORER_STATE_AFTER_NAVIGATION[3].active).toBeTruthy();
  });
});

describe("the close dialog function works correctly", () => {
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
});
