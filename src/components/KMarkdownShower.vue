<template>
  <k-markdown-vue
    class="k-markdown-shower"
    :value="content"
    :options="{
      components: {
        ...defaultComponents,
        'code-block': KCustomCodeBlock as never,
        link: KCustomLink as never,
      },
      highlight: highlighterByShiki,
    }"
  />
</template>
<script setup lang="ts">
import KMarkdownVue from '@kuankuan/k-markdown-vue/src/KMarkdownVue.vue';
import defaultComponents from '@kuankuan/k-markdown-vue/src/nodesEle/default';
import '@/styles/markdown.scss';
import KCustomCodeBlock from './markdown/KCustomCodeBlock.vue';
import KCustomLink from './markdown/KCustomLink.vue';
import { highlighterByShiki } from '@/scripts/codeHighlight';
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
