<template>
  <div
    class="article-root"
    :class="{
      'no-article': noArticle,
      loading: loading,
    }"
  >
    <k-markdown-shower class="article-shower" :content="article" />
    <router-link :to="'/' + nextButton.to" custom v-slot="{ navigate }">
      <div
        @click="
          () => {
            navigate();
            nextButton.disabled = true;
          }
        "
        class="next-button"
        :class="{
          disabled: nextButton.disabled,
          hidden: nextButton.hidden,
        }"
      >
        <p class="next-button-content">
          <span>{{ nextButton.contetn }}</span>
          <k-icon class="next-button-icon" v-if="!nextButton.disabled" id="arrow-down" />
        </p>
      </div>
    </router-link>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import KMarkdownShower from '@/components/KMarkdownShower.vue';
import KIcon from '../components/KIcon.vue';
import findContent from '@/scripts/findContent';
const props = defineProps<{
  pathMatch: string | string[];
}>();

const article = ref('Loading');
const noArticle = ref(true);
const loading = ref(true);
const nextButton = reactive({
  disabled: true,
  contetn: 'Loading',
  to: '',
  hidden: false,
});
const pathTree = computed(() => {
  const pathTree = Array.isArray(props.pathMatch) ? props.pathMatch : [props.pathMatch];
  if (pathTree[pathTree.length - 1] === '') {
    pathTree.pop();
  }
  return pathTree;
});
watchEffect(() => {
  const nowContent = findContent(pathTree.value);
  if (nowContent === null) {
    nextButton.disabled = false;
    nextButton.contetn = 'No Data';
    nextButton.to = '/';
    nextButton.hidden = true;
  } else {
    if (nowContent.nextValue) {
      nextButton.disabled = false;
      nextButton.hidden = false;
      nextButton.contetn = nowContent.nextValue.title;
      nextButton.to = nowContent.nextValue.list.join('/');
    } else {
      nextButton.disabled = true;
      nextButton.hidden = false;
      nextButton.contetn = 'No Next Page';
      nextButton.to = '/';
    }
  }
});
const articleName = computed(() => {
  const nowContent = findContent(pathTree.value);
  if (nowContent === null) {
    return '404.md';
  }
  return nowContent.article;
});
function getArticleURL() {
  return new URL(`../articles/${articleName.value}`, import.meta.url);
}
watchEffect(() => {
  noArticle.value = true;
  loading.value = true;
  article.value = 'Loading';
  fetch(getArticleURL()).then(
    async (res) => {
      loading.value = false;
      if (res.ok) {
        article.value = await res.text();
        noArticle.value = false;
      } else {
        article.value = 'Get Article Failed';
      }
    },
    () => {
      article.value = 'Get Article Failed';
    }
  );
});
</script>
<style lang="scss">
.article-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  &.no-article {
    justify-content: center;
    align-items: center;
    height: 100%;
    & > .article-shower {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      text-align: center;
    }
  }
  &.loading {
    & > .article-shower {
      animation: loading 0.5s linear infinite alternate;
      @keyframes loading {
        from {
          opacity: 1;
        }
        to {
          opacity: 0.4;
        }
      }
    }
  }
}

.next-button {
  min-height: 20vh;

  @include useTheme {
    background-image: linear-gradient(to left, getTheme('color'), getTheme('color'));
  }

  flex-grow: 1;
  background-size: 25% 1px;
  background-position: top center;
  user-select: none;

  cursor: pointer;

  &.disabled {
    pointer-events: none;

    & > .next-button-content {
      opacity: 0.3;
    }
  }

  &.hidden {
    display: none;
  }

  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  & > .next-button-content {
    font-size: 1.5rem;
    margin: 0;
    margin-bottom: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    & > .next-button-icon {
      transform: rotate(-90deg);
    }
    column-gap: 0rem;
  }
  &:hover {
    & > .next-button-content {
      column-gap: 2rem;
      margin-left: 1rem;
      & > .next-button-icon {
        transform: rotate(-90deg) scale(1.5);
      }
    }
  }
}

.article-shower {
  padding: 1rem;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &::before {
      opacity: 0.2;
    }
  }

  @function repeat-character($char, $times) {
    $result: '';

    @for $i from 1 through $times {
      $result: #{$result}#{$char};
    }

    @return '#{$result}';
  }

  @for $i from 1 through 6 {
    h#{$i} {
      &::before {
        padding-right: #{0.2rem + (6-$i) * 0.1rem};
        content: repeat-character('#', $i);
      }
    }
  }

  blockquote {
    margin: 0 0 0 0.5rem;
    padding: 1px 0 1px 0.5rem;

    & p {
      margin: 0.5rem 0 0.5rem 0;
    }

    @include useTheme {
      background: rgba(getTheme('color'), 0.05);
      border-left: 0.5rem solid rgba(getTheme('color'), 0.3);
    }
  }
}
</style>
