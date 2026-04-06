import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import autoImport from 'unplugin-auto-import/vite';
import Inspect from 'vite-plugin-inspect';
import { visualizer } from 'rollup-plugin-visualizer';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const sassAddition = `
@use '@/styles/theme.scss';
@use '@kuankuan/assist-2026/styles/motion.scss';
@use 'sass:math';
@use 'sass:color';`;
const dirname = import.meta.dirname.replaceAll('\\', '/');
function getNodeModulesPath(name: string) {
  return path.posix.join(dirname, 'node_modules', name);
}

const chunkConfig = {
  markdown: [
    getNodeModulesPath('showdown'),
    getNodeModulesPath('showdown-katex'),
    getNodeModulesPath('katex'),
  ],
  hightlight: [getNodeModulesPath('highlight.js')],
};

const extToDir = {
  script: ['.js'],
  style: ['.css'],
  font: ['.ttf', '.woff', '.woff2', '.eot', '.otf'],
  image: ['.png', '.jpg', '.svg', '.gif'],
} as const;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Inspect(),
    autoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/types/auto-imports.d.ts',
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: './temp/test.html',
      open: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
        autoprefixer({
          overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'],
          grid: true,
        }),
        cssnano(),
      ],
    },
    preprocessorOptions: {
      scss: {
        additionalData: sassAddition,
      },
      sass: {
        additionalData: sassAddition,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: Object.entries(chunkConfig).map(([key, value]) => ({
            name: key,
            test: (id) => {
              return value.some((item) => id.startsWith(item));
            },
          })),
        },
        entryFileNames: function (chunkInfo) {
          const pathName = (
            path.dirname(chunkInfo.facadeModuleId!).slice(__dirname.replace(/\\/g, '/').length) +
            '/script/[name]-[hash].js'
          ).slice(1);
          return pathName;
        },
        chunkFileNames: function () {
          return 'script/[name]-[hash].js';
        },
        assetFileNames: function (chunkInfo) {
          if (chunkInfo.source === '/* vite internal call, ignore */') {
            return chunkInfo.names[0];
          }

          for (const i in extToDir) {
            if (
              extToDir[i as keyof typeof extToDir].some((ext) => chunkInfo.names[0].endsWith(ext))
            ) {
              return `${i}/[name]-[hash].[ext]`;
            }
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
});
