/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    expect: { requireAssertions: true },
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,ts}"]
  }
});
