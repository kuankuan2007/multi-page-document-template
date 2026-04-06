<template>
  <button class="theme-button clear" @click="changeToNextTheme">
    <k-icon
      :id="
        {
          auto: 'os-follow',
          light: 'light',
          dark: 'night',
        }[themeValue]!
      "
      class="theme-button-icon"
    />
  </button>
</template>
<script setup lang="ts">
import KIcon from './KIcon.vue';
import { themeValue, themeValueList } from '@kuankuan/assist-2026/theme';
function changeToNextTheme() {
  themeValue.value =
    themeValueList[(themeValueList.indexOf(themeValue.value) + 1) % themeValueList.length]!;
}
</script>
<style scoped lang="scss">
button.theme-button {
  appearance: none;
  all: unset;
  font-size: 2em;
  cursor: pointer;
  @include motion.transition(0.3s);
  padding: 0.1em;
  border: 0.1em solid transparent;
  border-radius: 0.3em;

  &:focus {
    @include theme.use {
      border-color: theme.get('active-color');
    }
  }

  &:hover {
    @include theme.use {
      color: theme.get('active-color');
    }
  }
}
</style>
