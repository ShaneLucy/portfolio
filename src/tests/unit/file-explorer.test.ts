import setSvgMargin from "../../components/desktop/components/dialog/components/file-explorer";

describe("the svg margin is set correctly", () => {
  test("given a width less than 400 it returns the string '0'", () => {
    expect(setSvgMargin(399)).toEqual("0");
  });

  test("given a width greater than 400 it returns the string '0 0 0 0.5rem'", () => {
    expect(setSvgMargin(401)).toEqual("0 0 0 0.5rem");
  });
});
