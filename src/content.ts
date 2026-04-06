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
    detail: {
      article: 'detail/index.md',
      title: '项目细节',
      subArticles: {
        content: {
          article: 'detail/content.md',
          title: '内容系统',
        },
        theme: {
          article: 'detail/theme.md',
          title: '主题',
        },
        tooling: {
          article: 'detail/tooling.md',
          title: '工程化',
        },
      },
    },
    test: {
      article: 'test.md',
      title: '测试',
    },

    thanks: {
      article: 'thanks.md',
      title: '致谢',
    },
  },
};
export const notFound: ArticleOptions = {
  article: '404.md',
  title: 'Not Found',
};
export default content;
