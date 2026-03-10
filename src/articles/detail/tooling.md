# 工程化细节：脚本、Lint/Format、PostCSS

本文把这个模板里“跑起来、规范化、构建优化”的细节集中说明。

---

## 1. npm scripts 一览

来自 `package.json`：

- `npm run dev`
  - 启动 Vite 开发服务器
- `npm run build`
  - 执行 `vite build`
- `npm run preview`
  - 本地预览构建产物
- `npm run lint`
  - 执行 `eslint . --fix`
  - **会自动修复**可修复的问题
- `npm run format`
  - 执行 `prettier --write src/`
  - 只格式化 `src/` 下的文件
- `npm run load-fontello`
  - 执行 `load-fontello`
  - 这是来自 `@kuankuan/assist-2026` 提供的 bin：用于把 fontello 配置产物同步/生成到项目内（配合 `src/assets/fontello/`）

开发环境建议（见 README）：

- Node `24.14.0`

---

## 2. ESLint：规则来源与结构

配置在 `eslint.config.ts`（Flat Config）：

- 需要 lint 的文件：`**/*.{ts,mts,tsx,vue}`
- 全局忽略：`dist/`、`dist-ssr/`、`coverage/`
- Vue 规则：`eslint-plugin-vue` 的 `flat/essential`
- TS 规则：`@vue/eslint-config-typescript` 的 `recommended`
- 与 Prettier 协作：`@vue/eslint-config-prettier/skip-formatting`
  - 它会关闭“和 Prettier 冲突的格式化类规则”，避免一边 eslint 一边 prettier 打架

另外加了一条项目自定义规则：

- `prefer-const: error`

执行方式：

- `npm run lint` 等价于 `eslint . --fix`

---

## 3. Prettier：格式化风格

配置在 `.prettierrc`：

- `semi: true`
- `singleQuote: true`
- `trailingComma: 'es5'`
- `printWidth: 100`
- `tabWidth: 2`
- `.vue` 文件使用 `parser: 'vue'`

执行方式：

- `npm run format` 会对 `src/` 进行覆盖式格式化

---

## 4. PostCSS：本模板用了哪些插件？

配置在 `vite.config.ts` 的 `css.postcss.plugins`：

### 4.1 postcss-preset-env

- 让你可以写更“现代”的 CSS，并按目标浏览器做降级/补齐（具体能力取决于 preset-env 内部启用的特性）

### 4.2 autoprefixer

- 自动补齐厂商前缀
- 项目里手动指定了 `overrideBrowserslist`：
  - `Android 4.1`, `iOS 7.1`, `Chrome > 31`, `ff > 31`, `ie >= 8`
- `grid: true`：在需要时对 CSS Grid 做前缀兼容处理

### 4.3 cssnano

- 压缩/优化最终 CSS（通常用于生产构建）

---

## 5. Vite 相关插件（与调试/构建分析）

同样来自 `vite.config.ts`：

- `@vitejs/plugin-vue`：编译 Vue SFC
- `vite-plugin-vue-devtools`：开发时 Vue DevTools
- `vite-plugin-inspect`：在浏览器里查看 Vite 插件转换结果
- `unplugin-auto-import`：自动导入 `vue` 与 `vue-router`
  - 生成类型声明到 `src/types/auto-imports.d.ts`
- `rollup-plugin-visualizer`：打包体积分布分析
  - 输出到 `temp/test.html`
  - `open: true` 会在构建时自动打开报告

---

## 6. SCSS 全局注入（跟主题文档相关）

`vite.config.ts` 还通过 `css.preprocessorOptions.scss.additionalData` 做了全局注入：

```scss
@use '@/styles/theme.scss';
@use 'sass:color';
```

因此你在任意组件的 `<style lang="scss">` 中都可以直接使用：

- `@include theme.use { ... }`
- `theme.get('token')` / `theme.mix(...)`
