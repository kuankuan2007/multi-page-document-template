<template>
  <router-link
    class="k-md-ele-router-link"
    v-if="linkContent.href"
    :to="linkContent.href"
    :title="props.node.args.alt"
    ><slot
  /></router-link>
  <a
    class="k-md-ele-link"
    v-else
    :href="linkContent.href"
    target="_blank"
    :title="props.node.args.alt"
    ><slot
  /></a>
</template>
<script setup lang="ts">
import type { KMarkdownLinkNode } from '@kuankuan/k-markdown-parser/nodes/core';

const props = defineProps<{
  node: KMarkdownLinkNode;
}>();

const linkContent = computed(() => {
  const href = props.node.args.href;
  if (!href) return { inSite: true, href: '' };
  const fullUrl = new URL(
    href,
    window.location.href.endsWith('/') ? window.location.href : window.location.href + '/'
  );

  return fullUrl.origin === window.location.origin
    ? { inSite: true, href: fullUrl.pathname + fullUrl.search + fullUrl.hash }
    : { inSite: false, href: fullUrl.href };
});
</script>
<style scoped lang="scss"></style>
