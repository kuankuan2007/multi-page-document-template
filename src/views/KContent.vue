<template>
  <div class="tree">
    <p class="title">
      <k-content-component :data="article" :path-tree="pathTree" />
    </p>
  </div>
</template>
<script setup lang="ts">
import KContentComponent from '../components/KContentComponent.vue';
import { article } from '@/scripts/findContent';
const props = defineProps<{
  pathMatch: string[] | string;
}>();
const pathTree = computed(() => {
  const pathTree: (string | null)[] = (
    Array.isArray(props.pathMatch) ? props.pathMatch : [props.pathMatch]
  ).filter((i) => i);
  pathTree.unshift(null);
  return pathTree;
});
</script>
<style scoped lang="scss"></style>
