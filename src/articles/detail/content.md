# 内容系统与 content.ts 配置说明

本模板把“长文档”拆成多篇 Markdown，并通过：

- `src/content.ts`：声明文档目录树（标题、层级、文章文件路径）
- `src/scripts/findContent.ts`：把目录树变成可查找的 Article 结构，并提供“根据 URL 找文章”的函数
- `src/components/KArticle.vue`：通过 `import.meta.glob` 读取 Markdown 原文并渲染
- `src/components/KContentComponent.vue`：把目录树渲染成侧栏目录（并用 router-link 导航）

---

## 1. Markdown 放在哪里？

所有文档都在：

- `src/articles/**/*.md`

`KArticle.vue` 通过 Vite 的 glob import 把它们打包进来：

```ts
const articleRawLoaders = import.meta.glob('../articles/**/*.md', {
  query: '?raw',
  import: 'default',
});
```

然后在运行时按路径 `../articles/<article>` 取对应 loader。

### 1.1 文章路径的安全处理

`KArticle.vue` 会对 `content.ts` 里的 `article` 做 normalize：

- 去掉开头的 `/` 或 `./`
- 禁止任何路径段为 `..`

如果不合法，会显示 `Invalid Article Path`。

---

## 2. content.ts：如何描述目录树？

类型：

```ts
export type ArticleOptions = {
  article: string;
  title: string;
  subArticles?: Record<string, ArticleOptions>;
};
```

关键点：

- `article`：Markdown 文件路径（相对于 `src/articles/`）
  - 例：`'start.md'`
  - 例：`'detail/index.md'`
- `title`：显示标题（用于顶部 header 与侧栏）
- `subArticles`：子章节集合
  - **key 就是 URL 的路径段**
  - value 是对应的子文章配置

### 2.1 URL 是怎么映射到文章的？

路由只有一条 catch-all：

- `/:pathMatch(.*)*`

在 `KMain.vue` 中：

- `pathMatch` 会变成 `string | string[]`
- `getPathTree(pathMatch)` 会得到一个数组，并在最前面插入一个 `null`
  - 例如：URL `/project/thanks`
  - 得到 pathTree：`[null, 'project', 'thanks']`

`findContent(pathTree)` 会从根文章开始，按段向下找：

- 如果段存在于 `subArticles`，就进入对应子文章
- 否则返回 `notFound`（`src/articles/404.md`）

---

## 3. “下一篇”按钮的规则（顺序很重要）

`src/scripts/findContent.ts` 在构建 Article 树时会做一次 DFS，并用 `nextValue` 把文章串成链表。

这会影响：

- `KArticle.vue` 里底部“下一篇”按钮的目标与文案

顺序规则：

- 根文章先进入
- 然后按 `subArticles` 的 key 的**插入顺序**依次递归

因此你想控制阅读顺序时，最简单的方法是：

- 在 `content.ts` 里按你希望的顺序书写 `subArticles` 的字段

---

## 4. 如何替换成你自己的文档？

### 4.1 最小替换步骤

1. 把你的 Markdown 放到 `src/articles/`（可用子目录）
2. 修改 `src/content.ts`：
  - 替换根节点的 `article` 与 `title`
  - 替换/新增 `subArticles`
3. 删除或保留示例文章：
  - 删除不再使用的 `.md` 并不会影响运行，只要 `content.ts` 不再引用它们

### 4.2 新增一个二级章节（示例）

假设你新增：

- `src/articles/guide/index.md`
- `src/articles/guide/install.md`

你可以这样写：

```ts
subArticles: {
  guide: {
    article: 'guide/index.md',
    title: '指南',
    subArticles: {
      install: {
        article: 'guide/install.md',
        title: '安装',
      },
    },
  },
}
```

访问：

- `/guide` -> `guide/index.md`
- `/guide/install` -> `guide/install.md`

---

## 5. 常见问题

### 5.1 为什么改了 content.ts，但侧栏没有变化？

通常是因为：

- 你的 `subArticles` key 与 URL 不一致
- 或者 `article` 路径写错（大小写/目录层级）

### 5.2 404 的触发条件是什么？

只要 URL 的任一段在当前节点的 `subArticles` 中不存在，就会显示 `notFound` 对应文章（默认为 `404.md`）。
