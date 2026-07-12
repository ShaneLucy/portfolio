import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    expect: { requireAssertions: true },
    environment: "node",
    include: ["test/**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts", "src/**/*.svelte", "scripts/**/*.ts"],
      exclude: ["src/**/*.d.ts"],
      thresholds: {
        lines: 80,
        branches: 80
      }
    },
    projects: [
      {
        extends: "./vite.config.ts",
        resolve: {
          conditions: ["browser"]
        },
        test: {
          environment: "jsdom",
          include: ["test/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"]
        }
      },
      {
        test: {
          environment: "node",
          include: ["test/**/*.{test,spec}.{js,ts}"],
          exclude: ["test/**/*.svelte.{test,spec}.{js,ts}"]
        }
      }
    ]
  }
});
