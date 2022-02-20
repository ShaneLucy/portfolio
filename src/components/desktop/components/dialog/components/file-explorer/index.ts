const SMALL_TO_LARGE_BREAKPOINT = 400;

export default (windowInnerWidth: number): "0" | "0 0 0 0.5rem" =>
  windowInnerWidth < SMALL_TO_LARGE_BREAKPOINT ? "0" : "0 0 0 0.5rem";
