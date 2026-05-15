# 快速开始

## 下载项目

```bash
git clone https://github.com/kuankuan2007/multi-page-document-template.git
```

或者从其他位置

| [![Github](https://img.shields.io/badge/GitHub-black?logo=github)](https://github.com/kuankuan2007/multi-page-document-template) | [![gitee](<https://img.shields.io/badge/Gitee-rgb(199%2C29%2C35)?logo=gitee>)](https://gitee.com/kuankuan2007/multi-page-document-template) | [![Static Badge](<https://img.shields.io/badge/Gitab-rgb(226%2C67%2C41)?logo=gitlab>)](https://gitlab.com/kuankuan2007/multi-page-document-template) |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |

## 环境配置

本项目在Node 24.14.0 上开发，未再其他版本上测试。

如果你使用nvm管理node版本，你可以使用以下指令

```bash
nvm use
```

## 安装依赖

```bash
pnpm install
```

**注意** : 本项目中存在对等依赖兼容性问题，目前该依赖作者未提供解决方案，敬请谅解。

## 启动项目

```bash
pnpm dev
```

## 个性化配置

### 文档内容

文档目录在 `src/content.ts`中，配置内容见`ArticleOptions`类型定义：

- `title`: 文档标题，如：`快速开始`
- `article`: 文档名称（文档放在 `src/articles`目录下），如：`start.md`
- `subArticles`: 子文档列表

### 主题

本项目所有主题相关的配置使用[@kuankuan/assist-2026](https://github.com/kuankuan2007/assist-2026)库中提供的代码，这也是宽宽几乎所有项目都在使用的主题管理方式。

### 代码高亮（语言支持）

为了控制**打包体积**，本项目对代码高亮（`shiki` 优先 + `highlight.js` 兜底）的语言支持做了“静态内联 + 动态按需加载”的拆分：

- 默认只**静态打包**了本项目文档里用到的那一小部分语言；
- 另外配置了对一些**常见语言的动态导入**（需要时才会被加载）。

如果你需要额外语言（例如你准备在文档里新增 `kotlin` / `php` / `csharp` 等代码块），可以在 `vite.config.ts` 里调整 `VitePluginShikiAutoImport` 的 `lang.static` / `lang.dynamic` 配置。

更完整的原理与配置说明见：[代码高亮机制](detail/highlight)。
