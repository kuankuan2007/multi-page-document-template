<template>
  <k-markdown-shower class="article-shower" :content="article" />
</template>
<script setup>
import content from '../content'
import KMarkdownShower from '@/components/KMarkdownShower.vue';
import { ref, watchEffect, computed } from 'vue'
const props = defineProps({
  pathMatch: {
    type: [Array, String],
    required: true,
  },
})
const article = ref('Loading')
const pathTree = computed(() => {
  const pathTree = Array.isArray(props.pathMatch) ? props.pathMatch : [props.pathMatch]
  if (pathTree[pathTree.length - 1] === '') {
    pathTree.pop()
  }
  return pathTree
})
const articleName = computed(() => {
  let now = content
  for (let i of pathTree.value) {
    if (i in now.subArticles) {
      now = now.subArticles[i]
    } else {
      return '404.md'
    }
  }
  return now.article
})
function getArticleURL() {
  return new URL(`../articles/${articleName.value}`, import.meta.url)
}
watchEffect(() => {
  fetch(getArticleURL()).then(async (res) => {
    if (res.ok) {
      article.value = await res.text()
    }
    else {
      article.value = 'Get Article Failed'
    }
  }, () => {
    article.value = 'Get Article Failed'
  })
})
</script>
<style lang="scss">

.article-shower {
  padding: 1rem;
  @import "../assets/article.scss";
}
</style>