<template>
  <div class="main">
    <div class="content">
      <k-content :path-tree="pathTree" />
    </div>
    <div class="article" ref="articleDiv">
      <k-article :path-tree="pathTree" :article="targetArticle" />
    </div>
  </div>
</template>
<script setup lang="ts">
import KArticle from '@/components/KArticle.vue';
import KContent from '@/components/KContent.vue';

import findContent, { getPathTree } from '@/scripts/findContent';

const props = defineProps<{
  pathMatch: string | string[];
}>();
const pathTree = computed(() => getPathTree(props.pathMatch));
const targetArticle = computed(() => findContent(pathTree.value));

const emit = defineEmits<{
  (e: 'update:title', title: string): void;
}>();
watch(
  () => targetArticle.value.title,
  (value) => {
    emit('update:title', value);
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
$layoutLimit: 800px;
$header-height: 60px;
.main {
  width: 100%;
  height: calc(100% - $header-height);
  flex-grow: 1;
  display: flex;
  justify-content: start;
  position: relative;

  & > .content {
    flex-shrink: 0;
    @include theme.use {
      background: theme.mix('background', 'color', 95%);
    }
  }

  @media (max-width: #{$layoutLimit}) {
    .gap {
      opacity: 0;
      width: 0;
    }
    .content {
      position: absolute;
      width: 0%;
      overflow: hidden;
      height: 100%;

      & > * {
        width: max-content;
      }

      .show-content-menu & {
        width: 100%;
        position: absolute;
        overflow: auto;
      }
    }

    .article {
      flex-grow: 1;
      position: absolute;
      padding: 0.5rem;
      left: 0;
      width: calc(100% - 1rem);
      height: 100%;
      .show-content-menu & {
        left: 100%;
      }
    }
  }
}

.article {
  flex-grow: 1;
  flex-shrink: 1;
  column-gap: 2rem;
  overflow: hidden;
  position: relative;
}
</style>
