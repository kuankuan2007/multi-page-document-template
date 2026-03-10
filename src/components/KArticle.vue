<template>
  <div class="article-root">
    <transition-group name="page" :duration="300">
      <k-article-page
        class="page-item"
        v-for="page in pages"
        v-bind="page.config"
        :key="page.key"
      />
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { type Article } from '@/scripts/findContent';
import KArticlePage from './KArticlePage.vue';

const props = defineProps<{
  article?: Article;
}>();
const nextButtonStateNoData = {
  type: 'no-data',
} as const;
type PageConfig = {
  articleContent: string;
  blockInfo: undefined | 'loading' | 'invalid' | 'failed';
  nextButtonState: {
    type: 'normal' | 'no-data';
    content?: string;
    to?: string;
  };
};
const specialPageConfig = {
  loading: {
    articleContent: '',
    blockInfo: 'loading',
    nextButtonState: { type: 'no-data' },
  },
  invalid: {
    articleContent: '',
    blockInfo: 'invalid',
    nextButtonState: { type: 'no-data' },
  },
  failed: {
    articleContent: '',
    blockInfo: 'failed',
    nextButtonState: { type: 'no-data' },
  },
} as const;
const pages = reactive<
  {
    config: PageConfig;
    key: string;
    active: boolean;
  }[]
>([
  {
    config: specialPageConfig.loading,
    key: '__init__',
    active: true,
  },
]);

const articleRawLoaders = import.meta.glob('../articles/**/*.md', {
  query: '?raw',
  import: 'default',
});

function normalizeArticlePath(path: string) {
  const normalized = path.replace(/^\/+/, '').replace(/^\.\//, '');
  if (normalized.split('/').some((segment) => segment === '..')) {
    throw new Error('Invalid article path');
  }
  return normalized;
}

let pageKey = 0;
function pushPage(config: PageConfig) {
  pages.splice(0, pages.length);
  pages.push({
    config,
    key: String(pageKey++),
    active: true,
  });
}
function disablePage() {
  pages.forEach((page) => {
    if (page.config.blockInfo) return;
    page.active = false;
  });
}

let loadSeq = 0;

watch(
  () => props.article,
  (article, oldArticle, onCleanup) => {
    void oldArticle;

    const seq = ++loadSeq;
    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });

    disablePage();
    const articlePath = article?.article;
    if (!articlePath) {
      pushPage(specialPageConfig.invalid);
      return;
    }

    let key: string;
    try {
      key = `../articles/${normalizeArticlePath(articlePath)}`;
    } catch {
      pushPage(specialPageConfig.invalid);
      return;
    }

    const loader = articleRawLoaders[key];
    if (!loader) {
      pushPage(specialPageConfig.failed);
      return;
    }

    (async () => {
      try {
        const raw = (await loader()) as string;
        if (cancelled || seq !== loadSeq) return;
        pushPage({
          articleContent: raw,
          blockInfo: void 0,
          nextButtonState: article.nextValue
            ? {
                type: 'normal',
                content: article.nextValue.title,
                to: article.nextValue.list.join('/'),
              }
            : nextButtonStateNoData,
        });
      } catch {
        if (cancelled || seq !== loadSeq) return;
        pushPage(specialPageConfig.failed);
      }
    })();
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style lang="scss">
.page-item {
  position: absolute;
  inset: 0;
  overflow: auto;
  opacity: 1;
  &.page-enter-active,
  &.page-leave-active {
    transition: 0.3s;
  }
  &.page-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  &.page-leave-to {
    transform: translateX(-100%);
    user-select: none;
    pointer-events: none;
    opacity: 0;
  }
}
</style>
