<template>
  <div class="tree">
    <p class="title"><k-content-component :parents="[]" :fold="false" :select="!pathTree.length" :data="content" :path-tree="pathTree"/></p>
  </div>
</template>
<script setup>
import KContentComponent from "../components/KContentComponent.vue"
import content from "../content"
import {computed} from 'vue'
const props = defineProps({
  pathMatch:{
    type:[Array, String],
    required:true
  }
})
const pathTree = computed(()=>{
  const pathTree = Array.isArray(props.pathMatch)?props.pathMatch:[props.pathMatch]
  if (pathTree[pathTree.length-1]===''){
    pathTree.pop()
  }
  return pathTree
})
</script>
<style scoped lang="scss">

</style>