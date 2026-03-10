export declare type ArticleOptions = {
  article: string;
  title: string;
  subArticles?: Record<string, ArticleOptions>;
};

const content: ArticleOptions = {
  article: 'index.md',
  title: '开端',
  subArticles: {
    start: {
      article: 'start.md',
      title: '快速开始',
    },
    project: {
      article: 'project.md',
      title: '关于',
      subArticles: {
        thanks: {
          article: 'thanks.md',
          title: '致谢',
        },
      },
    },
  },
};
export const notFound: ArticleOptions = {
  article: '404.md',
  title: 'Not Found',
};
export default content;
