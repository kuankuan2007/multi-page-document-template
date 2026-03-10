import content, { type ArticleOptions, notFound } from '../content';

export type Article = {
  article: string;
  id: string | null;
  title: string;
  list: string[];
  nextValue?: Article;
  subArticles: Record<string, Article>;
};

function buildArticle(options: ArticleOptions):Article {
  let lastValue: Article | null = null;
  const dfs = (option: ArticleOptions, parents: string[], id: string | null = null) => {
    const res: Article = {
      ...option,
      id,
      list: parents,
      subArticles: {},
    };
    if (lastValue) {
      lastValue.nextValue = res;
    }
    lastValue = res;
    if (option.subArticles) {
      for (const i in option.subArticles) {
        res.subArticles[i] = dfs(option.subArticles[i], [...parents, i], i);
      }
    }
    return res;
  };
  return dfs(options, []);
}

export const article = buildArticle(content);
export const notFoundArticle = buildArticle(notFound);

export default function (pathTree: (string | null)[]) {
  if (pathTree[0] !== null) {
    throw new Error('pathTree[0] must be null');
  }
  let now = article;
  for (const i of pathTree.slice(1)) {
    if (now.subArticles && (i as string) in now.subArticles) {
      now = now.subArticles[i as string];
    } else {
      return notFoundArticle;
    }
  }
  return now;
}
export function getPathTree(pathMatch: string | string[]) {
  const pathTree: (string | null)[] = (
    Array.isArray(pathMatch) ? pathMatch : [pathMatch]
  ).filter((i) => i);
  pathTree.unshift(null);
  return pathTree;
}
export function getPathTreeFromPath(path: string) {
  const pathMatch = path.split('/').filter((i) => i);
  return getPathTree(pathMatch);
}