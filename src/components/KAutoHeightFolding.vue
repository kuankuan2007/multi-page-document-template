<template>
  <div
    class="fold-box"
    :class="{
      fold: props.fold,
    }"
    ref="foldBox"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    fold?: boolean;
  }>(),
  {
    fold: false,
  }
);
</script>
<style scoped lang="scss">
.fold-box {
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;
  &.fold {
    grid-template-rows: 0;
  }
}
</style>
