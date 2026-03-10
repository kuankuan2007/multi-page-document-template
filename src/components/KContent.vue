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
defineProps<{
  pathTree: (string | null)[];
}>();

</script>
<style scoped lang="scss"></style>
