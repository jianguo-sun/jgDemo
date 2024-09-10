import { defineConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  ElementPlusResolver,
  AntDesignVueResolver,
} from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import config from "./config.json"
import { resolve } from "path";
export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const viteEnv = loadEnv(mode, root);
  return {
    base: viteEnv.VITE_BASE_URL,
    // base: config.base,
    plugins: [
      vue({ refTransform: true }),
      AutoImport({
        resolvers: [AntDesignVueResolver()],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          AntDesignVueResolver({
            importStyle: false,
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": resolvePath("src"),
      },
      extensions: [".js", ".ts", ".jsx", ".tsx", ".vue"],
    },
    //测试环境跨域配置
    server: {
      port: 8080,
      proxy: {
        "/dev-api": {
          // target: "http://10.4.114.144:8070",
          target: "http://10.4.120.109:8070",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-api/, ""),
        },
        // "/map": {
        //   target: "https://echarts.apache.org",
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/map/, ""),
        // },
      },
    },
  }
});

function resolvePath(paths) {
  return resolve(__dirname, paths);
}
