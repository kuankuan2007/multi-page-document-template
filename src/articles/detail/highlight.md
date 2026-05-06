# 代码高亮机制

该模板对包含各种语言代码块在内的渲染引擎进行了深度整合，并废弃了原有的基于原生 `k-markdown-vue` 的仅使用 `highlight.js` 方案。重构引入了 **`shiki` + `highlight.js` 兜底** 策略，保证高保真的语法高亮的同时也能拥有优雅降级的能力。此外实现了一套专门针对 `shiki` 按需加载打包的 Vite 插件，解决首屏或构建体积过大的痛点。

## 1. 原理解析与渲染流程

渲染代码块时，内部会经历这套高亮分析系统（核心位于 `src/scripts/codeHighlight.ts`），按照以下流程进行：

1. **推断语言**：若代码块包含语言指定（如 \`\`\`ts \），则优先使用；若未包含，则使用 `flourite` 进行语言猜测。
2. **第一优先级 (`shiki`)**：调用通过 Vite 插件注入的 `getShikiWithLang` 进行渲染。`shiki` 基于 TextMate 语法，能提供与 VS Code 完全一致、极具表现力的精准颜色渲染。并自动结合深色和浅色主题。
3. **兜底渲染 (`highlight.js`)**：若 `shiki` 中未配置该语言的支持文件（或抛出错误），则回退使用 `highlight.js` 进行渲染。即使指定的语言不支持，也会使用 `highlight.js` 的 `highlightAuto` 自动尽力适配。
4. **渲染组件**：最终由自定义组件 `KCustomCodeBlock.vue` 显示高亮结果。

## 2. vite-plugin-shiki-auto-import 插件

由于 `shiki` 目前直接全量引入会增加海量的打包产物体积。为了充分掌控代码高亮的语言支持和主题样式包含范围，本项目特别实现了一个按需打包的 Vite 编译插件：`vite-plugin/kShikiAutoImport.ts`。

借助此插件，你可以全盘控制 `shiki` 配置中动态（异步加载）和静态（内联打包）加载的主题和语言：

### 配置入口

此插件在工程根目录的 `vite.config.ts` 中完成配置：

```ts
import VitePluginShikiAutoImport from './vite-plugin/kShikiAutoImport';

// ...
plugins: [
  // ... 其他插件
  VitePluginShikiAutoImport({
    theme: {
      static: ['github-dark', 'github-light'], // 静态打包内联的默认主题
      dynamic: [] // 可异步下载的动态主题
    },
    lang: {
      static: ['typescript', 'javascript', 'vue', 'json', 'bash', 'markdown', 'html', 'css', 'scss'], // 首屏/常用语言立刻打包进去
      dynamic: ['python', 'rust', 'go', 'java', 'c', 'cpp'] // 较少用但需要支持异步加载获取的语言
    }
  })
]
```

### 插件导出能力

在前端代码中，该插件在构建时注册为虚拟模块 `visual:k-shiki-auto-import.ts`，提供了开箱即用的方法：

- `getShiki()`: 初始化并返回 shiki 实例。
- `getShikiWithLang(lang)`: 保证所需语言已（动态或静态）加载完毕后返回 shiki 实例。
- `loadLangs(shiki, lang)` / `loadTheme(theme)`: 单独提供动态异步按需加载能力。

## 3. 依赖 k-markdown-vue 新特性的底层支持

之所以能够无缝并且优雅地完成上述两套高亮方案的整合，主要得益于底层 `@kuankuan/k-markdown-vue` 引擎在新版本中提供的两个关键特性的支持：

1. **`HighlightInterface` 的异步支持**：新版完全支持了异步的 `highlight` 返回。由于引入 `shiki` 必须涉及到 Wasm 的初始化以及通过动态 `import()` 按需拉取模块词典，只有在底层接口支持 Promise/异步 的前提下，这套异步兜底高亮系统才得以实现。
2. **`HighlighterInfo` 的范型扩展能力**：为了让外层 Vue 渲染组件确切知道某一段代码到底是由 `shiki` 还是 `highlight.js` 渲染的（从而应用不同的 CSS 预设），我们需要传递额外标记。新版本支持对高亮返回的属性结构 `HighlighterInfo` 进行扩展。本项目在 `codeHighlight.ts` 中声明了 `HighlighterInfoByShiki`，扩展并塞入了 `highlightBy: 'hljs' | 'shiki'` 字段，最终在自定义终端代码块组件 `KCustomCodeBlock.vue` 中获取并渲染对应逻辑。
