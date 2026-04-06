<template>
  <div
    class="fold-box"
    :class="{
      fold: props.fold,
    }"
    ref="foldBox"
  >
    <div class="fold-item">
      <slot />
    </div>
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
  @include motion.transition(grid-template-rows 0.3s);

  overflow: hidden;
  &.fold {
    grid-template-rows: 0fr;
  }
  .fold-item{
    overflow: hidden;
  }
}
</style>
