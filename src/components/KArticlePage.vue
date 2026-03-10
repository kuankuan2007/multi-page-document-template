<template>
  <div class="article-page">
    <div class="article-area">
      <div v-if="blockInfo" class="block-info">
        <p>{{ blockInfoContent[blockInfo] }}</p>
      </div>
      <k-markdown-shower v-else class="article-shower" :content="articleContent" />
    </div>
    <router-link :to="'/' + nextButtonState.to" custom v-slot="{ navigate }">
      <div
        @click="navigate()"
        class="next-button"
        :class="{
          disabled: nextButtonState.type !== 'normal',
          hidden: !nextButtonState.content,
        }"
      >
        <p class="next-button-content">
          <span>{{ nextButtonState.content }}</span>
          <k-icon class="next-button-icon" v-if="!(nextButtonState.type !== 'normal')" id="right" />
        </p>
      </div>
    </router-link>
  </div>
</template>
<script setup lang="ts">
import KMarkdownShower from '@/components/KMarkdownShower.vue';
import KIcon from '../components/KIcon.vue';
defineProps<{
  articleContent: string;
  blockInfo: undefined | 'loading' | 'invalid' | 'failed';
  nextButtonState: {
    type: 'normal' | 'no-data';
    content?: string;
    to?: string;
  };
}>();
const blockInfoContent = {
  loading: 'Loading',
  invalid: 'Invalid Article Path',
  failed: 'Get Article Failed',
} as const;
</script>
<style scoped lang="scss">
.article-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.next-button {
  min-height: 20vh;

  @include theme.use {
    background-image: linear-gradient(to left, theme.get('color'), theme.get('color'));
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
    transition: 0.3s;

    column-gap: 0rem;
    .next-button-icon {
      transition: 0.3s;
    }
  }
  &:hover {
    & > .next-button-content {
      column-gap: 2rem;
      margin-left: 1rem;
      & > .next-button-icon {
        transform: scale(1.5);
      }
    }
  }
}

.article-shower {
  padding: 1.5rem;
}
.block-info {
  padding: 1rem;
  font-size: 2em;
  font-weight: bold;
  color: theme.get('color');
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
