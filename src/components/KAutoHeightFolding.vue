<template>
    <div class="fold-box" :class="
    {
        fold: props.fold
    }" ref="foldBox">
        <slot />
    </div>
</template>
<script setup>

const props = defineProps({
    fold: {
        type: Boolean,
        default: false,
        required: false
    }
})
</script>
<style scoped lang="scss">
.fold-box {
    display: grid;
    grid-template-rows: 1fr;
    overflow: hidden;
    &.fold{
        grid-template-rows: 0;
    }
}
</style>