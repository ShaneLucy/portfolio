import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";
import { init, parse } from "es-module-lexer";

// 1 kB = 1000 bytes, so the numbers match Vite's build log.
export const BYTES_PER_KB = 1000;
// Initial JS budget (D10), in bytes of gzip: 150 kB.
export const INITIAL_JS_BUDGET_GZIP_BYTES = 150 * BYTES_PER_KB;

const HTML_FILE_NAME = "index.html";
const KB_DECIMALS = 2;
const COLUMN_GAP = "  ";
const NUMBER_COLUMN_WIDTH = 12;
const STATIC_IMPORT_TYPES: ReadonlySet<string> = new Set(["static", "reexport-star"]);
const RELATIVE_SPECIFIER_PREFIX = ".";
const JS_EXTENSION = ".js";
const FILE_COLUMN_HEADER = "File";
const noPreloadsMessage = (htmlPath: string): string =>
  `${htmlPath} has no modulepreload links. The check can't see the route files without them, ` +
  "because Kit loads them with dynamic import(). Kit's output.linkHeaderPreload may have been " +
  "switched on, which is a regression on a static host anyway.";

const LINK_TAG_PATTERN = /<link\b[^>]*>/gi;
const REL_MODULEPRELOAD_PATTERN = /\brel\s*=\s*["']?modulepreload["']?/i;
const HREF_PATTERN = /\bhref\s*=\s*["']([^"']+)["']/i;
const INLINE_SCRIPT_PATTERN = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
const DYNAMIC_IMPORT_PATTERN = /\bimport\(\s*(["'`])([^"'`]+)\1\s*\)/g;

export type SizeCheckErrorKind = "missing-html" | "no-bootstrap" | "no-preloads" | "missing-file";

export class SizeCheckError extends Error {
  readonly kind: SizeCheckErrorKind;

  constructor(kind: SizeCheckErrorKind, message: string) {
    super(message);
    this.name = "SizeCheckError";
    this.kind = kind;
  }
}

export interface InitialFile {
  readonly absolutePath: string;
  readonly content: Buffer;
}

export interface FileSize {
  readonly path: string;
  readonly rawBytes: number;
  readonly gzipBytes: number;
}

export interface SizeReport {
  readonly files: readonly FileSize[];
  readonly totalRawBytes: number;
  readonly totalGzipBytes: number;
  readonly budgetGzipBytes: number;
  readonly headroomGzipBytes: number;
  readonly isWithinBudget: boolean;
}

export interface Logger {
  readonly log: (message: string) => void;
  readonly error: (message: string) => void;
}

interface PendingFile {
  readonly absolutePath: string;
  readonly referencedFrom: string;
}

export function extractModulepreloadHrefs(html: string): string[] {
  const hrefs: string[] = [];
  for (const [tag] of html.matchAll(LINK_TAG_PATTERN)) {
    const href = REL_MODULEPRELOAD_PATTERN.test(tag) ? HREF_PATTERN.exec(tag)?.[1] : undefined;
    if (href?.endsWith(JS_EXTENSION)) {
      hrefs.push(href);
    }
  }
  return hrefs;
}

export function extractBootstrapImports(html: string): string[] {
  const specifiers: string[] = [];
  for (const [, scriptBody] of html.matchAll(INLINE_SCRIPT_PATTERN)) {
    for (const [, , specifier] of scriptBody.matchAll(DYNAMIC_IMPORT_PATTERN)) {
      if (specifier.endsWith(JS_EXTENSION)) {
        specifiers.push(specifier);
      }
    }
  }
  return specifiers;
}

/** Relative specifiers of static imports and `export ... from`; dynamic `import()` is skipped. */
export async function findStaticImports(code: string): Promise<string[]> {
  await init;
  const [imports] = parse(code);
  const specifiers: string[] = [];
  for (const { type, specifier } of imports) {
    if (STATIC_IMPORT_TYPES.has(type) && specifier?.startsWith(RELATIVE_SPECIFIER_PREFIX)) {
      specifiers.push(specifier);
    }
  }
  return specifiers;
}

function readReferencedFile(absolutePath: string, referencedFrom: string): Buffer {
  if (!existsSync(absolutePath)) {
    throw new SizeCheckError("missing-file", `${absolutePath} is referenced from ${referencedFrom} but does not exist.`);
  }
  return readFileSync(absolutePath);
}

/** Reads one file, records it, and queues the files it statically imports. */
async function visitFile(
  { absolutePath, referencedFrom }: PendingFile,
  visited: Map<string, InitialFile>,
  queue: PendingFile[]
): Promise<void> {
  const content = readReferencedFile(absolutePath, referencedFrom);
  visited.set(absolutePath, { absolutePath, content });
  for (const specifier of await findStaticImports(content.toString("utf-8"))) {
    queue.push({
      absolutePath: resolve(dirname(absolutePath), specifier),
      referencedFrom: absolutePath
    });
  }
}

export async function collectInitialJs(buildDir: string): Promise<InitialFile[]> {
  const htmlPath = resolve(buildDir, HTML_FILE_NAME);
  if (!existsSync(htmlPath)) {
    throw new SizeCheckError("missing-html", `${htmlPath} not found. Run the build first.`);
  }
  const html = readFileSync(htmlPath, "utf-8");
  const htmlDir = dirname(htmlPath);

  const bootstrapImports = extractBootstrapImports(html);
  if (bootstrapImports.length === 0) {
    throw new SizeCheckError("no-bootstrap", `No bootstrap import() of a .js entry found in ${htmlPath}.`);
  }

  const preloadHrefs = extractModulepreloadHrefs(html);
  if (preloadHrefs.length === 0) {
    throw new SizeCheckError("no-preloads", noPreloadsMessage(htmlPath));
  }

  const queue: PendingFile[] = [...bootstrapImports, ...preloadHrefs].map((href) => ({
    absolutePath: resolve(htmlDir, href),
    referencedFrom: htmlPath
  }));
  const visited = new Map<string, InitialFile>();

  for (let next = queue.shift(); next !== undefined; next = queue.shift()) {
    if (!visited.has(next.absolutePath)) {
      await visitFile(next, visited, queue);
    }
  }

  return [...visited.values()];
}

function toDisplayPath(buildDir: string, absolutePath: string): string {
  return relative(buildDir, absolutePath).split(sep).join("/");
}

export function buildReport(buildDir: string, files: readonly InitialFile[], budgetGzipBytes: number): SizeReport {
  const sizes: FileSize[] = files
    .map(({ absolutePath, content }) => ({
      path: toDisplayPath(buildDir, absolutePath),
      rawBytes: content.byteLength,
      gzipBytes: gzipSync(content).byteLength
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
  const totalRawBytes = sizes.reduce((sum, file) => sum + file.rawBytes, 0);
  const totalGzipBytes = sizes.reduce((sum, file) => sum + file.gzipBytes, 0);
  return {
    files: sizes,
    totalRawBytes,
    totalGzipBytes,
    budgetGzipBytes,
    headroomGzipBytes: budgetGzipBytes - totalGzipBytes,
    isWithinBudget: totalGzipBytes <= budgetGzipBytes
  };
}

function formatKb(bytes: number): string {
  return `${(bytes / BYTES_PER_KB).toFixed(KB_DECIMALS)} kB`;
}

function formatRow(label: string, labelWidth: number, raw: string, gzip: string): string {
  return [label.padEnd(labelWidth), raw.padStart(NUMBER_COLUMN_WIDTH), gzip.padStart(NUMBER_COLUMN_WIDTH)].join(COLUMN_GAP);
}

export function formatReport(report: SizeReport): string {
  const labelWidth = Math.max(FILE_COLUMN_HEADER.length, ...report.files.map((f) => f.path.length));
  const header = formatRow(FILE_COLUMN_HEADER, labelWidth, "Raw", "Gzip");
  const rows = report.files.map((file) => formatRow(file.path, labelWidth, formatKb(file.rawBytes), formatKb(file.gzipBytes)));
  const total = formatRow("Total", labelWidth, formatKb(report.totalRawBytes), formatKb(report.totalGzipBytes));
  const headroomLabel = report.isWithinBudget ? "Headroom" : "Over budget by";
  const headroom = formatKb(Math.abs(report.headroomGzipBytes));
  const verdict = report.isWithinBudget ? "PASS" : "FAIL";
  return [
    header,
    ...rows,
    total,
    "",
    `Budget: ${formatKb(report.budgetGzipBytes)} gzip`,
    `${headroomLabel}: ${headroom}`,
    `${verdict}: initial JS is ${formatKb(report.totalGzipBytes)} gzip across ${report.files.length} files.`
  ].join("\n");
}

/** Runs the whole check and returns the process exit code. */
export async function runSizeCheck(buildDir: string, budgetGzipBytes: number, logger: Logger): Promise<number> {
  try {
    const files = await collectInitialJs(buildDir);
    const report = buildReport(buildDir, files, budgetGzipBytes);
    logger.log(formatReport(report));
    return report.isWithinBudget ? 0 : 1;
  } catch (error) {
    if (!(error instanceof SizeCheckError)) {
      throw error;
    }
    logger.error(`FAIL: ${error.message}`);
    return 1;
  }
}
