# Markdown 渲染引擎

本模板的 Markdown 渲染引擎已从 **showdown** 全面切换为完全自研的双库组合：

- [`@kuankuan/k-markdown-parser`](https://github.com/kuankuan2007/k-markdown-parser) —— 将 Markdown 文本解析为结构化语法树（AST）
- [`@kuankuan/k-markdown-vue`](https://github.com/kuankuan2007/k-markdown-vue) —— 将 AST 渲染为 Vue 3 组件树

---

## 1. 为什么要替换 showdown？

showdown 将 Markdown 直接编译为 HTML 字符串，这意味着：

- 渲染产物是"死的"HTML，无法在 Vue 组件树中集成交互逻辑
- 无法对特定节点类型（如代码块、链接）注入自定义 Vue 组件
- 扩展语法需要侵入式地操作字符串，容易产生冲突和安全隐患

新的双库方案通过**先解析为 AST，再由 Vue 负责渲染**，彻底解决了上述问题。

---

## 2. @kuankuan/k-markdown-parser

### 2.1 核心特性

| 特性 | 说明 |
| --- | --- |
| **零依赖** | 纯 TypeScript/JavaScript，无任何运行时依赖 |
| **轻量** | IIFE bundle 仅约 28 KB |
| **高性能** | 性能与 showdown 相当，正则驱动的解析核心 |
| **完全可扩展** | 语法规则、节点类型、整个解析管道均可自定义 |
| **多模块格式** | 同时提供 ESM、CJS、IIFE |
| **结构化输出** | 输出 AST（`KMarkdownRootNode`），而非 HTML 字符串 |

### 2.2 内置节点类型（语法支持）

解析器开箱即支持主流 Markdown 语法，包括：

- 标题（`#` 至 `######`）、段落、引用块
- 代码块（含语言标识）、行内代码
- **LaTeX 块/行内公式**（`$$...$$`、`$...$`）
- 加粗、斜体、删除线、上标、下标
- 有序/无序/任务列表
- 图片、链接、邮件地址、Emoji
- 表格（含对齐方式）
- XML/HTML 标签节点
- 分割线

### 2.3 可扩展的解析管道

解析管道通过 `SyntaxesGroup[]` 定义，每个 group 包含若干 `KMarkdownSyntax` 规则，并可通过 `next` 字段控制子内容的递归解析策略。

例如，新增一个 `==高亮==` 语法只需：

```ts
import KMarkdownParser from '@kuankuan/k-markdown-parser';
import { defaultSyntaxes, defaultNodeMap } from '@kuankuan/k-markdown-parser/options';
import { KMarkdownNode } from '@kuankuan/k-markdown-parser';

class KMarkdownHighlightNode extends KMarkdownNode {
  id = 'highlight';
}

const highlightSyntax = {
  name: 'highlight',
  matcher(text) {
    return [...text.matchAll(/==(.+?)==/gs)].map((m) => ({
      startIndex: m.index,
      length: m[0].length,
      node: { name: 'highlight', content: [m[1]] },
    }));
  },
};

const parser = new KMarkdownParser({
  syntaxes: defaultSyntaxes.map((group) =>
    group.name === 'inline'
      ? { ...group, syntaxes: [...group.syntaxes, highlightSyntax] }
      : group
  ),
  nodeMap: { ...defaultNodeMap, highlight: KMarkdownHighlightNode },
});
```

---

## 3. @kuankuan/k-markdown-vue

### 3.1 核心特性

| 特性 | 说明 |
| --- | --- |
| **Vue 3 + TypeScript** | 完整类型支持，与 Vue 3 生态深度集成 |
| **基于 AST 渲染** | 通过 `@kuankuan/k-markdown-parser` 产出的 AST 驱动渲染，而非 `v-html` |
| **内置 LaTeX 支持** | 集成 KaTeX，通过 `options.latex` 配置（按需开启） |
| **内置代码高亮** | 集成 highlight.js，自带主题 CSS |
| **安全的 XML 处理** | 默认以 `'warn'` 方式处理 XML 节点，防止 XSS |
| **完全可替换的渲染器** | 每种节点类型均可通过 `options.components` 注入自定义 Vue 组件 |

### 3.2 在本模板中的实际使用

本模板中，`KMarkdownShower.vue` 使用 `KMarkdownVue` 组件渲染文章内容：

```vue
<KMarkdownVue :value="markdownText" :options="options" />
```

其中 `options.components` 中注入了本模板自定义的：

- `KCustomCodeBlock.vue`：代码块渲染（含语言标签、一键复制等）
- `KCustomLink.vue`：链接渲染（内部链接使用 `router-link`，外部链接新标签打开）

这正是基于 AST 渲染的核心优势——无需任何 hack，只需为指定节点 id 提供一个 Vue 组件即可。

### 3.3 KMarkdownVueOptions 配置参考

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `parserOptions` | `Option`（来自 k-markdown-parser） | `undefined` | 透传给解析器的配置 |
| `latex` | `'ignore' \| 'warn' \| 'default' \| KatexOptions` | `undefined` | LaTeX 渲染策略；`'default'` 使用 KaTeX 默认配置 |
| `xml` | `'ignore' \| 'warn' \| 'preserve' \| (node) => VNode` | `'warn'` | XML 节点处理策略 |
| `components` | `Record<string \| symbol, Component>` | 内置默认渲染器 | 按节点 id 覆盖渲染器 |

---

## 4. 与 showdown 的对比

| 维度 | showdown | k-markdown |
| --- | --- | --- |
| 输出产物 | HTML 字符串 | AST → Vue 组件树 |
| 自定义节点渲染 | 困难（字符串操作） | 简单（按 id 注入 Vue 组件） |
| Vue 集成 | 需要 `v-html`，存在 XSS 风险 | 原生 Vue 渲染，无需 `v-html` |
| LaTeX 支持 | 需要额外插件，兼容性差 | 内置 KaTeX 集成，开箱即用 |
| 扩展语法 | 字符串正则替换，易冲突 | 标准化 `KMarkdownSyntax` 接口，管道可控 |

---

## 5. 相关源码位置

- `src/components/KMarkdownShower.vue`：Markdown 渲染入口组件
- `src/components/markdown/KCustomCodeBlock.vue`：自定义代码块渲染器
- `src/components/markdown/KCustomLink.vue`：自定义链接渲染器
- `src/styles/markdown.scss`：Markdown 内容区样式
