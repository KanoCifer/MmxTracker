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
    action: {
      default_icon: {
        '16': 'icon/16.png',
        '32': 'icon/32.png',
        '48': 'icon/48.png',
        '96': 'icon/96.png',
        '128': 'icon/128.png',
        '512': 'icon/512.png',
      },
    },
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
