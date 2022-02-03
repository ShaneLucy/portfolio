import { getFileExplorerActiveIndex } from "../../helpers";
import type { FileExplorerMenu } from "../../types";
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
