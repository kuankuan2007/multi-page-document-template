import content, { type ArticleOptions } from '../content';

export type Article = {
  article: string;
  id: string | null;
  title: string;
  list: string[];
  nextValue?: Article;
  subArticles: Record<string, Article>;
};

export const article = (() => {
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
  return dfs(content, []);
})();

export default function (nameList: string[]) {
  let nowContent = article;
  for (const i of nameList) {
    if (nowContent.subArticles && i in nowContent.subArticles) {
      nowContent = nowContent.subArticles[i];
    } else {
      return null;
    }
  }
  return nowContent;
}
