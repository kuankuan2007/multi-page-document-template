<template>
    <span class="demo-icon">{{ String.fromCharCode(config.glyphs.find((value, index) => {
        return value.css == props.name
    }).code) }}</span>
</template>
<script setup>
import config from '../fontello/config.json'
config.glyphs
const props = defineProps({
    name: {
        type: String,
        required: true
    }
})
</script>
<style scoped lang="scss"></style>