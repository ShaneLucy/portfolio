import { INITIAL_JS_BUDGET_GZIP_BYTES, runSizeCheck } from "./initial-js-size.ts";

const BUILD_DIR = "build";

process.exitCode = await runSizeCheck(BUILD_DIR, INITIAL_JS_BUDGET_GZIP_BYTES, console);
