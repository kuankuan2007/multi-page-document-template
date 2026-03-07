# 快速开始

## 下载项目

```bash
git clone https://github.com/kuankuan2007/multi-page-document-template.git
```

或者从其他位置

| [![Github](https://img.shields.io/badge/GitHub-black?logo=github)](https://github.com/kuankuan2007/multi-page-document-template) | [![gitee](https://img.shields.io/badge/Gitee-rgb(199%2C29%2C35)?logo=gitee)](https://gitee.com/kuankuan2007/multi-page-document-template) | [![Static Badge](https://img.shields.io/badge/Gitab-rgb(226%2C67%2C41)?logo=gitlab)](https://gitlab.com/kuankuan2007/multi-page-document-template) |
| --------------------------------------------------------------------------------------------------------------------------- | ---- | ---- |

## 环境配置

本项目在Node 20.11.0 上开发，未再其他版本上测试。

如果你使用nvm管理node版本，你可以使用以下指令

```bash
nvm use
```

## 安装依赖

```bash
npm i
```

**注意** : 本项目中存在对等依赖兼容性问题，目前该依赖作者未提供解决方案，敬请谅解。

## 启动项目

```bash
npm run dev
```

## 个性化配置

### 文档内容

文档目录在 `src/content.js`下，每层目录配置的字段如下：

+ `title`: 文档标题
+ `article`: 文档名称（文档放在 `src/articles`目录下）
+ `subArticles`: 子文档列表

### 主题

文档主题在 `src/theme`下，在 `theme.scss`中配置颜色等信息，在 `theme.ts`中配置相关切换逻辑。
