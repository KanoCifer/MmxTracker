import { defineConfig } from "wxt";
import { resolve } from "node:path";
import tailwindcss from '@tailwindcss/vite'


// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  alias: {
    "@": resolve("src"),
  },
  modules: ["@wxt-dev/module-react"],

  manifest: {
    host_permissions: [
      "https://platform.minimaxi.com/*",
      "https://www.minimaxi.com/*",
    ],
    permissions: [
      'tabs',
      'storage',
      'alarms',
    ],
  },
});
