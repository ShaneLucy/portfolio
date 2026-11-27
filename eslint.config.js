import prettier from "eslint-config-prettier";
import path from "node:path";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import sonarjs from "eslint-plugin-sonarjs";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";
import { loadConfig } from "@sveltejs/load-config";

const svelteConfig = (await loadConfig("./", { traverse: false }))?.config;

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

const COGNITIVE_COMPLEXITY_LIMIT = 15;

// Every block must share these settings: typescript-eslint builds one project service from
// whichever file it lints first, so blocks that differ make lint results depend on file order.
const PROJECT_SERVICE = true;

// Keeps three.js out of the initial chunk (D25): only the scene folder may import it, and
// everything else reaches the scene through a dynamic import(), which this rule doesn't flag.
const SCENE_FOLDERS = ["src/lib/book/scene/**", "test/lib/book/scene/**"];
const THREE_IMPORT_PATTERN = "^three(/|$)"; // "three" and "three/addons/...", "three/examples/jsm/..."
// Matches "#lib/book/scene/x", "./scene/x" and "../book/scene/x" alike.
const SCENE_IMPORT_PATTERN = "(^|/)scene(/|$)";
const THREE_IMPORT_MESSAGE =
  "three may only be imported inside src/lib/book/scene/**, which loads with a dynamic import() so three stays out of the initial chunk.";
const SCENE_IMPORT_MESSAGE = "Load the scene with a dynamic import() so three stays out of the initial chunk.";

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  prettier,
  svelte.configs.prettier,
  sonarjs.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
      "no-console": ["error", { allow: ["error", "warn", "info"] }], // S106
      "no-duplicate-imports": "error", // S3863
      "@typescript-eslint/no-non-null-assertion": "error", // S2966
      "no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1, 2, 3],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true
        }
      ] // S109
    }
  },
  {
    // Type-aware rules for plain TypeScript files
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: PROJECT_SERVICE
      }
    },
    rules: {
      "@typescript-eslint/no-unnecessary-type-assertion": "error" // S4325
    }
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: PROJECT_SERVICE,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig
      }
    },
    rules: {
      "@typescript-eslint/no-unnecessary-type-assertion": "error" // S4325
    }
  },
  {
    files: ["**/*.ts", "**/*.js", "**/*.svelte"],
    ignores: SCENE_FOLDERS,
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            { regex: THREE_IMPORT_PATTERN, message: THREE_IMPORT_MESSAGE, allowTypeImports: true },
            { regex: SCENE_IMPORT_PATTERN, message: SCENE_IMPORT_MESSAGE, allowTypeImports: true }
          ]
        }
      ]
    }
  },
  {
    // CLI scripts: console output and numeric literals are intentional
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
      "no-magic-numbers": "off"
    }
  },
  {
    rules: {
      curly: ["error", "all"],
      "prefer-template": "error",
      "no-continue": "error",
      "sonarjs/cognitive-complexity": ["error", COGNITIVE_COMPLEXITY_LIMIT],
      "sonarjs/elseif-without-else": "error"
    }
  }
);
