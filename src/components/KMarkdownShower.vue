<template>
  <k-markdown-vue
    :value="content"
    :options="{
      components: {
        ...defaultComponents,
        'code-block': KCustomCodeBlock as never,
      },
    }"
  />
</template>
<script setup lang="ts">
import KMarkdownVue from '@kuankuan/k-markdown-vue/src/KMarkdownVue.vue';
import defaultComponents from '@kuankuan/k-markdown-vue/src/nodesEle/default';
import '@/styles/markdown.scss';
import KCustomCodeBlock from './markdown/KCustomCodeBlock.vue';
withDefaults(
  defineProps<{
    headerLevelStart?: number;
    content: string;
  }>(),
  {
    headerLevelStart: 1,
  }
);
</script>
<style scoped lang="scss"></style>
