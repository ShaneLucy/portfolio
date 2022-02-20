import type { FileExplorerMenu } from "types";
import {
  setSvgMargin,
  setNextTabAsActive,
  setPreviousTabAsActive,
  setActiveTab,
  getFileExplorerActiveIndex,
} from "../../components/desktop/components/dialog/components/file-explorer";
import Home from "../../components/desktop/components/dialog/components/file-explorer/components/Home.svelte";

describe("the file explorer utility functions work correctly", () => {
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
        active: false,
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
    expect(getFileExplorerActiveIndex(FILE_EXPLORER_STATE)).toEqual(1);
  });
});

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

describe("the svg margin is set correctly", () => {
  test("given a width less than 400 it returns the string '0'", () => {
    expect(setSvgMargin(399)).toEqual("0");
  });

  test("given a width greater than 400 it returns the string '0 0 0 0.5rem'", () => {
    expect(setSvgMargin(401)).toEqual("0 0 0 0.5rem");
  });
});
