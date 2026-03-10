<template>
  <div
    class="page"
    :class="{
      'show-content-menu': showContentMenu,
    }"
  >
    <header>
      <k-icon
        @click="showContentMenu = !showContentMenu"
        class="show-content-menu-button"
        :id="showContentMenu ? 'article' : 'menu'"
      />
      <h1>{{ title }}</h1>
      <k-theme-change-button />
    </header>
    <router-view v-slot="{ Component }">
      <component :is="Component" @update:title="title = $event" />
    </router-view>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import router from './router';

import KIcon from './components/KIcon.vue';
import KThemeChangeButton from './components/KThemeChangeButton.vue';
const title = ref('');
const articleDiv = useTemplateRef('articleDiv');
router.beforeEach(() => {
  showContentMenu.value = false;
  if (articleDiv.value) {
    articleDiv.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
});
const showContentMenu = ref(false);
</script>
<style scoped lang="scss">
$layoutLimit: 800px;
$header-height: 60px;

.page {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;

  & > header {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: $header-height;
    height: $header-height;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    padding-left: 1rem;
    padding-right: 1rem;

    @include theme.use {
      background: theme.mix('background', 'color', 90%);
    }

    & > h1 {
      text-align: center;
      flex-grow: 1;
      line-height: $header-height;
      margin: 0;
      word-wrap: none;
      white-space: nowrap;
      overflow-x: auto;
    }
  }
}

.show-content-menu-button {
  cursor: pointer;
  font-size: 30px;
  margin: 0;
  padding: 0;

  @media (min-width:#{$layoutLimit}) {
    & {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
