<template>
  <div class="page" :class="{
    'show-content-menu': showContentMenu,
  }">
    <header>
      <k-icon @click="showContentMenu = !showContentMenu" class="show-content-menu-button"
        :name="showContentMenu ? 'article' : 'menu'" />
      <h1>{{ getTitie() }}</h1>
      <k-theme-change-button />
    </header>
    <div class="main">
      <div class="content">
        <router-view name="content" />
      </div>
      <div class="gap"></div>
      <div class="article">
        <router-view name="article" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue"
import router from './router'

import { RouterView, useRoute, } from 'vue-router'
import content from './content';
import KIcon from "./components/KIcon.vue";
import KThemeChangeButton from './components/KThemeChangeButton.vue';
function getTitie() {
  let pathTree = useRoute().params.pathMatch
  if (!Array.isArray(pathTree)) {
    pathTree = [pathTree]
  }
  if (pathTree[pathTree.length - 1] === '') {
    pathTree.pop()
  }
  let now = content
  for (const i of pathTree) {
    if (i in now.subArticles) {
      now = now.subArticles[i]
    } else {
      return "404"
    }
  }
  return now.title
}
router.beforeEach((to, from, next) => {
  showContentMenu.value = false
  next()
})
const showContentMenu = ref(false)
</script>
<style scoped lang="scss">
@import "./theme/theme.scss";
$layoutLimit: 800px;
$header-height: 60px;

.page {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;

  &>header {
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

    &>h1 {
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

.main {
  width: 100%;
  height: calc(100% - $header-height);
  flex-grow: 1;
  display: flex;
  justify-content: start;
  position: relative;
  &>.gap{
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 1px;
    height: 80%;
    align-self: center;
    @include useTheme{
      background: linear-gradient(to bottom, transparent, getTheme("color") 30% 70%, transparent);
    }
  }
  &>.content {
    flex-shrink: 0;
  }

  @media (max-width: #{$layoutLimit}) {
    .gap{
      opacity: 0;
      width: 0;
    }
    .content {
      position: absolute;
      width: 0%;
      overflow: hidden;
      height: 100%;

      @include useTheme {
        background: getTheme("background");
      }

      &>* {
        width: max-content;
      }

      .show-content-menu & {
        width: 100%;
        position: absolute;
        overflow: auto;
      }
    }

    .article {
      flex-grow: 1;
      position: absolute;
      padding: 0.5rem;
      left: 0;
      width: calc(100% - 1rem);

      .show-content-menu & {
        left: 100%;
      }
    }
  }
}

.article {
  overflow-y: scroll;
  flex-grow: 1;
  flex-shrink: 1;
  overflow-x: hidden;
  column-gap: 2rem;
}</style>
