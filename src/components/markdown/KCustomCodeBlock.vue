<template>
  <k-markdown-code-block :node="node">
    <template #assistant="{ lang, code }">
      <div class="assistant">
        <div class="lang">{{ lang }}</div>
        <button
          class="copy-code"
          @click="
            () => {
              copyText(code);
              setCopied();
            }
          "
        >
          <k-icon :id="copied ? 'tick' : 'copy'" />
        </button>
      </div>
    </template>
  </k-markdown-code-block>
</template>
<script setup lang="ts">
import type { KMarkdownCodeBlockNode } from '@kuankuan/k-markdown-parser/nodes/core';
import KMarkdownCodeBlock from '@kuankuan/k-markdown-vue/src/nodesEle/KMdEleCodeBlock.vue';
import { copyText } from '@kuankuan/assist-2026/utils';
import KIcon from '../KIcon.vue';
defineProps<{
  node: KMarkdownCodeBlockNode;
}>();
let last: number;
function setCopied() {
  clearTimeout(last);
  last = setTimeout(() => (copied.value = false), 800);
  copied.value = true;
}
const copied = ref(false);
</script>
<style scoped lang="scss">
.k-md-ele-code-block {
  padding: 1em 1em 0 1em;
  @include theme.use {
    background-color: theme.mix('active-color', 'background', 2%);
    border-color: theme.mix('color', 'background', 10%);
  }
  border: 0.1em solid;
  border-radius: 0.5em;
  position: relative;
  overflow: hidden;

  .lang {
    align-items: center;
    font-size: 0.8em;
    position: absolute;
    top: 0;
    left: 0;
    border: 0.1em solid;
    user-select: none;

    padding: 0.2em 1em;
    border-radius: 0 0.4em 1em 0.4em;
    @include theme.use {
      background-color: theme.mix('active-color', 'background', 15%);
      border-color: theme.mix('active-color', 'background', 20%);
    }
  }
  .copy-code {
    align-items: center;
    font-size: 1.2em;
    position: absolute;
    top: 0;
    right: 0;

    border: solid 0.1em transparent;
    padding: 0.2em;
    cursor: pointer;
    border-radius: 0.3em 0 0.3em 0.5em;
    transition:
      color 0.3s,
      background 0.3s;
    @include theme.use {
      background-color: theme.mix('active-color', 'background', 10%);
      color: theme.mix('active-color', 'color', 50%);
    }
    &:hover,
    &:focus {
      @include theme.use {
        background-color: theme.mix('active-color', 'background', 20%);
        color: theme.get('active-color');
      }
    }
  }
}
</style>
