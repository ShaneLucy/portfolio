import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, sep } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import {
  BYTES_PER_KB,
  INITIAL_JS_BUDGET_GZIP_BYTES,
  SizeCheckError,
  buildReport,
  collectInitialJs,
  extractBootstrapImports,
  extractModulepreloadHrefs,
  findStaticImports,
  formatReport,
  runSizeCheck,
  type Logger,
  type SizeCheckErrorKind
} from "../../scripts/initial-js-size.ts";

const TEMP_DIR_PREFIX = "initial-js-size-";
const ENTRY_PATH = "_app/immutable/entry/start.AAA.js";
const APP_PATH = "_app/immutable/entry/app.BBB.js";
const CHUNK_A = "_app/immutable/chunks/a.js";
const CHUNK_B = "_app/immutable/chunks/b.js";
const CHUNK_C = "_app/immutable/chunks/c.js";
const LAZY_CHUNK = "_app/immutable/chunks/lazy.js";
const ONE_BYTE_OVER_BUDGET = 1;
const KB_FIXTURE_BYTES = 2500;
const EXPECTED_BYTES_PER_KB = 1000;
const EXPECTED_BUDGET_BYTES = 150_000;

function bootstrapScript(...paths: string[]): string {
  const imports = paths.map((path) => `import("./${path}")`).join(".then(()=>");
  return `<script>{${imports}}</script>`;
}

function preloadLink(path: string): string {
  return `<link href="./${path}" rel="modulepreload">`;
}

function htmlPage(parts: string[]): string {
  return `<!doctype html><html><head>${parts.join("")}</head><body></body></html>`;
}

type LogFn = (message: string) => void;

interface SpyLogger {
  readonly logger: Logger;
  readonly log: Mock<LogFn>;
  readonly error: Mock<LogFn>;
}

function createLogger(): SpyLogger {
  const log = vi.fn<LogFn>();
  const error = vi.fn<LogFn>();
  return { logger: { log, error }, log, error };
}

describe("initial JS size check", () => {
  let buildDir: string;

  function writeBuildFile(relativePath: string, content: string): void {
    const target = join(buildDir, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }

  async function collectedPaths(): Promise<string[]> {
    const files = await collectInitialJs(buildDir);
    return files.map((file) => relative(buildDir, file.absolutePath).split(sep).join("/")).sort((a, b) => a.localeCompare(b));
  }

  async function failureKind(): Promise<SizeCheckErrorKind | undefined> {
    try {
      await collectInitialJs(buildDir);
    } catch (error) {
      return error instanceof SizeCheckError ? error.kind : undefined;
    }
    return undefined;
  }

  beforeEach(() => {
    buildDir = mkdtempSync(join(tmpdir(), TEMP_DIR_PREFIX));
  });

  afterEach(() => {
    rmSync(buildDir, { recursive: true, force: true });
  });

  describe("extractModulepreloadHrefs", () => {
    it("returns the href of every modulepreload link", () => {
      const html = htmlPage([preloadLink(CHUNK_A), preloadLink(CHUNK_B)]);

      const hrefs = extractModulepreloadHrefs(html);

      expect(hrefs).toEqual([`./${CHUNK_A}`, `./${CHUNK_B}`]);
    });

    it("ignores links that are not modulepreload", () => {
      const html = htmlPage([`<link href="./style.js" rel="stylesheet">`]);

      const hrefs = extractModulepreloadHrefs(html);

      expect(hrefs).toEqual([]);
    });

    it("ignores modulepreload links without an href", () => {
      const html = htmlPage([`<link rel="modulepreload">`]);

      const hrefs = extractModulepreloadHrefs(html);

      expect(hrefs).toEqual([]);
    });

    it("ignores modulepreload links to files that are not js", () => {
      const html = htmlPage([`<link href="./data.json" rel="modulepreload">`]);

      const hrefs = extractModulepreloadHrefs(html);

      expect(hrefs).toEqual([]);
    });
  });

  describe("extractBootstrapImports", () => {
    it("returns every js file the inline script imports", () => {
      const html = htmlPage([bootstrapScript(ENTRY_PATH, APP_PATH)]);

      const imports = extractBootstrapImports(html);

      expect(imports).toEqual([`./${ENTRY_PATH}`, `./${APP_PATH}`]);
    });

    it("ignores scripts that load an external file", () => {
      const html = htmlPage([`<script src="./x.js">import("./y.js")</script>`]);

      const imports = extractBootstrapImports(html);

      expect(imports).toEqual([]);
    });

    it("ignores dynamic imports of files that are not js", () => {
      const html = htmlPage([`<script>import("./data.json")</script>`]);

      const imports = extractBootstrapImports(html);

      expect(imports).toEqual([]);
    });
  });

  describe("findStaticImports", () => {
    it("finds minified named, namespace and side-effect imports", async () => {
      const code = `import{a as b}from"./one.js";import*as c from"./two.js";import"./three.js";b(c);`;

      const specifiers = await findStaticImports(code);

      expect(specifiers).toEqual(["./one.js", "./two.js", "./three.js"]);
    });

    it("finds re-exports", async () => {
      const code = `export{x}from"./one.js";export*from"./two.js";`;

      const specifiers = await findStaticImports(code);

      expect(specifiers).toEqual(["./one.js", "./two.js"]);
    });

    it("skips dynamic imports", async () => {
      const code = `import{a}from"./one.js";const l=()=>import("./lazy.js");a(l);`;

      const specifiers = await findStaticImports(code);

      expect(specifiers).toEqual(["./one.js"]);
    });

    it("skips non-relative specifiers", async () => {
      const code = `import"https://example.com/x.js";import"three";import"./one.js";`;

      const specifiers = await findStaticImports(code);

      expect(specifiers).toEqual(["./one.js"]);
    });

    it("skips import.meta", async () => {
      const code = `export const u=import.meta.url;`;

      const specifiers = await findStaticImports(code);

      expect(specifiers).toEqual([]);
    });
  });

  describe("collectInitialJs", () => {
    it("includes bootstrap imports and modulepreload links", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(ENTRY_PATH, APP_PATH)]));
      writeBuildFile(ENTRY_PATH, "export const s=1;");
      writeBuildFile(APP_PATH, "export const a=1;");
      writeBuildFile(CHUNK_A, "export const c=1;");

      const paths = await collectedPaths();

      expect(paths).toEqual([CHUNK_A, APP_PATH, ENTRY_PATH]);
    });

    it("follows static imports through a chain from A to B to C", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(CHUNK_A)]));
      writeBuildFile(CHUNK_A, `import{b}from"./b.js";export const a=b;`);
      writeBuildFile(CHUNK_B, `import{c}from"./c.js";export const b=c;`);
      writeBuildFile(CHUNK_C, "export const c=1;");

      const paths = await collectedPaths();

      expect(paths).toEqual([CHUNK_A, CHUNK_B, CHUNK_C]);
    });

    it("resolves static imports relative to the importing file", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(ENTRY_PATH), bootstrapScript(ENTRY_PATH)]));
      writeBuildFile(ENTRY_PATH, `import{a}from"../chunks/a.js";export const s=a;`);
      writeBuildFile(CHUNK_A, "export const a=1;");

      const paths = await collectedPaths();

      expect(paths).toEqual([CHUNK_A, ENTRY_PATH]);
    });

    it("does not follow dynamic imports inside a chunk", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(CHUNK_A)]));
      writeBuildFile(CHUNK_A, `export const a=()=>import("./lazy.js");`);
      writeBuildFile(LAZY_CHUNK, "export const l=1;");

      const paths = await collectedPaths();

      expect(paths).toEqual([CHUNK_A]);
    });

    it("lists a file once when it is preloaded and also imported", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_B), bootstrapScript(CHUNK_A)]));
      writeBuildFile(CHUNK_A, `import{b}from"./b.js";export const a=b;`);
      writeBuildFile(CHUNK_B, "export const b=1;");

      const paths = await collectedPaths();

      expect(paths).toEqual([CHUNK_A, CHUNK_B]);
    });

    it("handles import cycles", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(CHUNK_A)]));
      writeBuildFile(CHUNK_A, `import"./b.js";export const a=1;`);
      writeBuildFile(CHUNK_B, `import"./a.js";export const b=1;`);

      const paths = await collectedPaths();

      expect(paths).toEqual([CHUNK_A, CHUNK_B]);
    });

    it("counts a static import of a preloaded file that is not itself preloaded", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(ENTRY_PATH)]));
      writeBuildFile(ENTRY_PATH, "export const s=1;");
      writeBuildFile(CHUNK_A, `import"./b.js";export const a=1;`);
      writeBuildFile(CHUNK_B, "export const b=1;");

      const paths = await collectedPaths();

      expect(paths).toEqual([CHUNK_A, CHUNK_B, ENTRY_PATH]);
    });

    it("fails when the html has bootstrap imports but no modulepreload links", async () => {
      writeBuildFile("index.html", htmlPage([bootstrapScript(ENTRY_PATH)]));
      writeBuildFile(ENTRY_PATH, `import"../chunks/a.js";`);
      writeBuildFile(CHUNK_A, "export const a=1;");

      const kind = await failureKind();

      expect(kind).toBe("no-preloads");
    });

    it("fails when build/index.html is missing", async () => {
      const kind = await failureKind();

      expect(kind).toBe("missing-html");
    });

    it("fails when no bootstrap entry is found", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A)]));
      writeBuildFile(CHUNK_A, "export const a=1;");

      const kind = await failureKind();

      expect(kind).toBe("no-bootstrap");
    });

    it("fails when the html has no scripts or links at all", async () => {
      writeBuildFile("index.html", htmlPage([]));

      const kind = await failureKind();

      expect(kind).toBe("no-bootstrap");
    });

    it("fails when a bootstrap file is missing", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(ENTRY_PATH), bootstrapScript(ENTRY_PATH)]));

      const kind = await failureKind();

      expect(kind).toBe("missing-file");
    });

    it("fails when a modulepreload file is missing", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(ENTRY_PATH)]));
      writeBuildFile(ENTRY_PATH, "export const s=1;");

      const kind = await failureKind();

      expect(kind).toBe("missing-file");
    });

    it("fails when a statically imported file is missing", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(CHUNK_A)]));
      writeBuildFile(CHUNK_A, `import"./b.js";`);

      const kind = await failureKind();

      expect(kind).toBe("missing-file");
    });

    it("names the referencing file in a missing-file error", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(CHUNK_A)]));
      writeBuildFile(CHUNK_A, `import"./b.js";`);

      const failure = collectInitialJs(buildDir);

      await expect(failure).rejects.toThrow(/b\.js is referenced from .*a\.js/);
    });
  });

  describe("buildReport", () => {
    it("totals raw and gzip sizes and reports headroom under budget", () => {
      const content = Buffer.from("a".repeat(KB_FIXTURE_BYTES));
      const files = [
        { absolutePath: join(buildDir, "b.js"), content },
        { absolutePath: join(buildDir, "a.js"), content }
      ];

      const report = buildReport(buildDir, files, INITIAL_JS_BUDGET_GZIP_BYTES);

      expect(report.files.map((file) => file.path)).toEqual(["a.js", "b.js"]);
      expect(report.totalRawBytes).toBe(KB_FIXTURE_BYTES * 2);
      expect(report.totalGzipBytes).toBe(report.files[0].gzipBytes * 2);
      expect(report.headroomGzipBytes).toBe(INITIAL_JS_BUDGET_GZIP_BYTES - report.totalGzipBytes);
      expect(report.isWithinBudget).toBe(true);
    });

    it("passes when the total equals the budget exactly", () => {
      const content = Buffer.from("a".repeat(KB_FIXTURE_BYTES));
      const files = [{ absolutePath: join(buildDir, "a.js"), content }];
      const { gzipBytes } = buildReport(buildDir, files, INITIAL_JS_BUDGET_GZIP_BYTES).files[0];

      const report = buildReport(buildDir, files, gzipBytes);

      expect(report.isWithinBudget).toBe(true);
      expect(report.headroomGzipBytes).toBe(0);
    });

    it("fails when the total is over budget", () => {
      const content = Buffer.from("a".repeat(KB_FIXTURE_BYTES));
      const files = [{ absolutePath: join(buildDir, "a.js"), content }];
      const { gzipBytes } = buildReport(buildDir, files, INITIAL_JS_BUDGET_GZIP_BYTES).files[0];

      const report = buildReport(buildDir, files, gzipBytes - ONE_BYTE_OVER_BUDGET);

      expect(report.isWithinBudget).toBe(false);
      expect(report.headroomGzipBytes).toBe(-ONE_BYTE_OVER_BUDGET);
    });

    it("uses forward slashes in file paths", () => {
      const files = [{ absolutePath: join(buildDir, CHUNK_A), content: Buffer.from("x") }];

      const report = buildReport(buildDir, files, INITIAL_JS_BUDGET_GZIP_BYTES);

      expect(report.files[0].path).toBe(CHUNK_A);
    });
  });

  describe("formatReport", () => {
    it("prints a table with the total, budget and headroom", () => {
      const files = [{ absolutePath: join(buildDir, "a.js"), content: Buffer.from("a".repeat(KB_FIXTURE_BYTES)) }];
      const report = buildReport(buildDir, files, INITIAL_JS_BUDGET_GZIP_BYTES);

      const output = formatReport(report);

      expect(output).toContain("File");
      expect(output).toContain("a.js");
      expect(output).toContain("2.50 kB");
      expect(output).toContain("Total");
      expect(output).toContain("Budget: 150.00 kB gzip");
      expect(output).toContain("Headroom:");
      expect(output).toContain("PASS");
    });

    it("reports how far over budget the total is", () => {
      const files = [{ absolutePath: join(buildDir, "a.js"), content: Buffer.from("a".repeat(KB_FIXTURE_BYTES)) }];
      const report = buildReport(buildDir, files, 0);

      const output = formatReport(report);

      expect(output).toContain("Over budget by:");
      expect(output).toContain("FAIL");
      expect(output).not.toContain("Headroom:");
    });
  });

  describe("runSizeCheck", () => {
    function writeValidBuild(): void {
      writeBuildFile("index.html", htmlPage([preloadLink(CHUNK_A), bootstrapScript(ENTRY_PATH)]));
      writeBuildFile(ENTRY_PATH, `import"../chunks/a.js";`);
      writeBuildFile(CHUNK_A, "export const a=1;");
    }

    it("returns 0 and prints the report when under budget", async () => {
      writeValidBuild();
      const { logger, log, error } = createLogger();

      const exitCode = await runSizeCheck(buildDir, INITIAL_JS_BUDGET_GZIP_BYTES, logger);

      expect(exitCode).toBe(0);
      expect(log).toHaveBeenCalledOnce();
      expect(log.mock.calls[0][0]).toContain("PASS");
      expect(error).not.toHaveBeenCalled();
    });

    it("returns 1 and prints the report when over budget", async () => {
      writeValidBuild();
      const { logger, log } = createLogger();

      const exitCode = await runSizeCheck(buildDir, 0, logger);

      expect(exitCode).toBe(1);
      expect(log.mock.calls[0][0]).toContain("FAIL");
    });

    it("returns 1 and reports the problem when index.html is missing", async () => {
      const { logger, error } = createLogger();

      const exitCode = await runSizeCheck(buildDir, INITIAL_JS_BUDGET_GZIP_BYTES, logger);

      expect(exitCode).toBe(1);
      expect(error.mock.calls[0][0]).toContain("index.html not found");
    });

    it("returns 1 and explains the problem when there are no modulepreload links", async () => {
      writeBuildFile("index.html", htmlPage([bootstrapScript(ENTRY_PATH)]));
      writeBuildFile(ENTRY_PATH, "export const s=1;");
      const { logger, error } = createLogger();

      const exitCode = await runSizeCheck(buildDir, INITIAL_JS_BUDGET_GZIP_BYTES, logger);

      expect(exitCode).toBe(1);
      expect(error.mock.calls[0][0]).toContain("no modulepreload links");
      expect(error.mock.calls[0][0]).toContain("linkHeaderPreload");
    });

    it("returns 1 when a referenced file is missing", async () => {
      writeBuildFile("index.html", htmlPage([preloadLink(ENTRY_PATH), bootstrapScript(ENTRY_PATH)]));
      const { logger, error } = createLogger();

      const exitCode = await runSizeCheck(buildDir, INITIAL_JS_BUDGET_GZIP_BYTES, logger);

      expect(exitCode).toBe(1);
      expect(error.mock.calls[0][0]).toContain("does not exist");
    });

    it("rethrows errors that are not size check failures", async () => {
      mkdirSync(join(buildDir, "index.html"));
      const { logger } = createLogger();

      const run = runSizeCheck(buildDir, INITIAL_JS_BUDGET_GZIP_BYTES, logger);

      await expect(run).rejects.not.toBeInstanceOf(SizeCheckError);
    });
  });

  describe("budget constant", () => {
    it("is 150 kB of gzip, counting 1 kB as 1000 bytes", () => {
      expect(BYTES_PER_KB).toBe(EXPECTED_BYTES_PER_KB);
      expect(INITIAL_JS_BUDGET_GZIP_BYTES).toBe(EXPECTED_BUDGET_BYTES);
    });
  });
});
