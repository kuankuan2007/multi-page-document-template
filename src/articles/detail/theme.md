# 主题与颜色管理（@kuankuan/assist-2026）

本项目的主题系统完全来自 `@kuankuan/assist-2026`：

- 运行时主题切换：通过 `@kuankuan/assist-2026/theme` 把当前主题写到 `document.documentElement.dataset.theme`。
- 样式取色/混色：通过 `@kuankuan/assist-2026/styles/theme.scss` 提供的 SCSS mixin/function 与默认主题 `$defaultTheme`。
- 代码高亮主题：通过 `html[data-theme='light'|'dark']` 条件加载不同 highlight.js 主题（见 `src/styles/hljs.scss`）。

---

## 1. 主题运行时（TypeScript API）

### 1.1 自动初始化（必须）

入口在 `src/main.ts`：

- `import '@kuankuan/assist-2026/theme'` 会注册一个 `watch`，在主题变化时自动执行：
  - `document.documentElement.dataset.theme = theme.value`

也就是说：只要你的应用引入一次，就不需要在业务组件里手动操作 DOM。

### 1.2 导出的 API

`@kuankuan/assist-2026/theme` 导出 3 个东西：

- `themeValue: Ref<string>`
  - 持久化存储在 `localStorage` 的 key 为 `theme`
  - 默认值是 `'auto'`
- `themeValueList: string[]`
  - `['auto', 'light', 'dark']`
- `theme: ComputedRef<string>`
  - 当 `themeValue === 'auto'` 时，根据 `prefers-color-scheme: dark` 计算出 `'dark'` 或 `'light'`
  - 否则直接返回 `themeValue`

### 1.3 在组件中切换主题（示例）

本项目的 `src/components/KThemeChangeButton.vue` 就是标准用法：

```ts
import { themeValue, themeValueList } from '@kuankuan/assist-2026/theme';

themeValue.value =
  themeValueList[(themeValueList.indexOf(themeValue.value) + 1) % themeValueList.length]!;
```

你也可以直接设置：

- `themeValue.value = 'light'`
- `themeValue.value = 'dark'`
- `themeValue.value = 'auto'`

---

## 2. 样式取色（SCSS API）

### 2.1 默认主题 `$defaultTheme`

`@kuankuan/assist-2026/styles/theme.scss` 内置了 `$defaultTheme`，结构是一个 map，包含 `light` / `dark` 两套 token。

内置 token（light/dark 都有）：

- `link-color`
- `link-hover-color`
- `color`
- `background`
- `active-color`
- `em-bg-color`
- `strong-color`
- `name`

本模板没有自定义主题 map，完全使用它的默认 `$defaultTheme`。

### 2.2 `theme.use`：按主题作用域输出 CSS

本项目统一通过 `src/styles/theme.scss` 封装后使用：

```scss
@include theme.use {
  background: theme.get('background');
  color: theme.get('color');
}
```

它会在编译后生成类似：

- `html[data-theme='light'] ... { ... }`
- `html[data-theme='dark'] ... { ... }`

从而让 JS 侧只需要切换 `data-theme`，样式就自动跟随。

### 2.3 `theme.get`：取 token 值

```scss
@include theme.use {
  border-color: theme.get('active-color');
}
```

如果 token 不存在，Sass 会报错（这是刻意的，避免拼写错误静默失败）。

### 2.4 `theme.mix`：混色 + 透明度

```scss
@include theme.use {
  background: theme.mix('background', 'color', 90%);
  background: theme.mix('background', 'color', 85%, 0.5);
}
```

含义：

- 前两个参数可以是「token 名」或「直接的颜色值」
- `$ratio` 表示 mix 比例
- `$alpha` 表示透明度（最终会转成 `rgba(...)`）

---

## 3. 本项目如何注入 theme SCSS（为什么任何地方都能用 `theme.*`）

见 `vite.config.ts`：

- `css.preprocessorOptions.scss.additionalData` 会在每个 SCSS 文件顶部自动插入：

```scss
@use '@/styles/theme.scss';
@use 'sass:color';
```

所以你不需要在每个组件里重复写 `@use`。

`src/styles/theme.scss` 的作用是把 `@kuankuan/assist-2026/styles/theme.scss` 的能力重新暴露成更短的 API：

- `@include theme.use { ... }`
- `theme.get('token')`
- `theme.mix(...)`

---

## 4. 代码高亮的主题如何跟随（highlight.js）

`src/styles/hljs.scss` 根据 `html[data-theme]` 加载不同主题：

- `light`：`highlight.js/scss/vs`
- `dark`：`highlight.js/scss/monokai-sublime`

只要 `data-theme` 变化，高亮主题就自动变化。

---

## 5. 自定义主题颜色：两种推荐方式

### 方式 A：保持现状，仅替换 token 的使用点（最推荐）

如果你只是想“看起来不一样”，最省心的方式是：

- 尽量使用已有 token（`background` / `color` / `active-color` 等）
- 通过 `theme.mix(...)` 做层次、悬浮色、分割线色

这样你无需维护一套完整主题表。

### 方式 B：真的要自定义 `$themeConfig`（进阶）

`@kuankuan/assist-2026/styles/theme.scss` 的 `@mixin use($themeConfig: $defaultTheme)` 支持传入自定义主题 map。

但注意：本项目的 `src/styles/theme.scss` 目前把 `use/get/mix` 做成了“无参数的薄封装”，所以你若要全局换主题表，建议：

- 新建一个 `src/styles/theme.config.scss` 定义你的 `$myTheme`（结构与 `$defaultTheme` 一致）
- 然后修改 `src/styles/theme.scss`，让 `use/get/mix` 支持把 `$themeConfig` 透传下去

这样你依然能保持 `theme.*` 的统一用法，同时可替换整套 token。
