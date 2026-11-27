import adapter from "@sveltejs/adapter-static";
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

// Static site, so Kit's hourly version polling has nothing to detect.
const VERSION_POLL_DISABLED = 0;

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true)
      },
      adapter: adapter(),
      version: { pollInterval: VERSION_POLL_DISABLED }
    })
  ]
});
