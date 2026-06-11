import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
    ],

    server: {
      proxy: {
        "/glpi-api": {
          target: env.GLPI_PROXY_TARGET || "http://glpi.localhost",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/glpi-api/, env.GLPI_API_PATH || "/api.php/v2.3"),
        },

        "/glpi-legacy-api": {
          target: env.GLPI_PROXY_TARGET || "http://glpi.localhost",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(
              /^\/glpi-legacy-api/,
              env.GLPI_LEGACY_API_PATH || "/apirest.php",
            ),
        },

        "/local-api": {
          target: "http://localhost:8081",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/local-api/, "/api"),
        },
      },
    },
  };
});