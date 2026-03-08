<template>
  <div class="shower-root">
    <div v-html="show" ref="shower" class="shower"></div>
  </div>
</template>
<script setup lang="ts">
import data from '@/assets/fontello/data';
import showdown from 'showdown';
import hljs from 'highlight.js';
import showdownKatex from 'showdown-katex';

const props = withDefaults(
  defineProps<{
    headerLevelStart?: number;
    content: string;
  }>(),
  {
    headerLevelStart: 1,
  }
);
const shower = useTemplateRef('shower');

function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}
onMounted(() => {
  shower.value?.addEventListener('click', copyCode);
});

const converter = new showdown.Converter({
  parseImgDimensions: true,
  headerLevelStart: props.headerLevelStart,
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  simpleLineBreaks: true,
  openLinksInNewWindow: true,
  extensions: [
    showdownKatex({
      displayMode: true,
      throwOnError: false,
      errorColor: '#ff0000',
      output: 'html',
      delimiters: [{ left: '$', right: '$', display: false }],
    }),
  ],
});
/**
 *
 * @param {MouseEvent} event
 */
function copyCode(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if ('code' in target.dataset) {
    if (target.dataset.code) copyText(target.dataset.code);
    const tipEle = target.querySelector('.tip') as HTMLElement;
    console.log(target, tipEle);
    if (tipEle) {
      tipEle.innerText = String.fromCharCode(data['ok']);
      tipEle.classList.add('demo-icon');
      setTimeout(() => {
        tipEle.innerText = '复制';
        tipEle.classList.remove('demo-icon');
      }, 3000);
    }
  }
}
function makeHtml(markdown: string) {
  return converter.makeHtml(markdown);
}
const show = computed(() => {
  const html = makeHtml(props.content);
  const tempEle = document.createElement('div');
  tempEle.innerHTML = html;
  const codeBlocks = [...tempEle.querySelectorAll('code')];
  for (const i of codeBlocks) {
    hljs.highlightElement(i);
  }
  const codeBlocksPre = [...tempEle.querySelectorAll('pre>code.hljs')]
    .map((ele) => {
      return ele.parentElement;
    })
    .filter((ele) => ele !== null);
  for (const i of codeBlocksPre) {
    const codeEle = i.querySelector('code.hljs') as HTMLElement;
    if (!codeEle) continue;
    for (let j = 0; j < codeEle.classList.length; j++) {
      if (codeEle.classList[j].startsWith('language-')) {
        codeEle.style.setProperty('--language', `"${codeEle.classList[j].slice(9)}"`);
      }
    }
    const copy = document.createElement('div');
    const tip = document.createElement('div');
    copy.innerText = String.fromCharCode(data['copy']);
    tip.innerText = '复制';
    tip.classList.add('tip');
    copy.classList.add('copy-button');
    copy.classList.add('demo-icon');
    copy.dataset.code = codeEle.innerText;
    copy.insertBefore(tip, copy.firstChild);
    i.appendChild(copy);
  }
  return tempEle.innerHTML;
});

defineExpose({
  showBox: shower,
});
</script>
<style lang="scss" scoped>
@use 'sass:meta';
@use '@/assets/fontello/fontello.scss';

.shower-root:deep(.shower) {
  @include meta.load-css('katex/dist/katex.min');
  .katex {
    padding-left: 5px;
    margin-left: 5px;
    margin-right: 5px;
    padding-right: 5px;
    transition: 0.3s;
    background-color: #8881;

    .katex-display & {
      background-color: transparent;
      margin: 0;
      padding: 0;
      border-radius: 0;
    }
  }

  .katex-display {
    margin: 0;
    padding: 0.8em 0;
    padding-top: 1.1em;
    margin: 0.2em 0.2em;
    transition: 0.3s;
    position: relative;

    &::before {
      content: 'math';
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 0.3em;
      pointer-events: none;
      font-weight: normal;
      transition: 0.3s;
      padding: 0.2rem 0.5rem;
      height: 16px;
      line-height: 16px;

      @include useTheme {
        background: rgba(getTheme('background'), 0.5);
      }
    }
  }

  code {
    transition: 0.3s;
    font-family: 'Fira Code', 'Monaspace Neon', sans-serif;
    font-weight: lighter;
    font-size: 1em;
    cursor: text;
  }

  code * {
    transition: 0.3s;
  }

  pre > code.hljs {
    position: relative;
    padding-top: 1.6rem;
  }

  pre > code::before {
    content: var(--language);
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 0.3em;
    pointer-events: none;
    font-weight: normal;
    transition: 0.3s;
    padding: 0.2rem 0.5rem;
    height: 16px;
    line-height: 16px;

    @include useTheme {
      background: rgba(getTheme('background'), 0.5);
    }
  }

  pre {
    position: relative;
  }

  .copy-button {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 0.4rem;
    margin: 0;
    width: 14px;
    line-height: 14px;
    height: 14px;
    margin: 0;
    font-size: 1em;
    border-width: 0.06rem;
    border-style: solid;
    border-color: transparent;
    cursor: pointer;
    transition: 0.3s;
    user-select: none;

    @include useTheme {
      background: rgba(getTheme('background'), 0.5);
      color: getTheme('link-color');
    }

    &:hover {
      @include useTheme {
        color: getTheme('link-hover-color');
        border-color: getTheme('link-hover-color');
      }

      & > .tip {
        opacity: 1;
        transform: translate(-50%, -100%);
      }
    }

    @include fontello.fontello;

    & > .tip {
      position: absolute;
      padding: 0.5rem;
      top: -1rem;
      left: 50%;
      transform: translate(-50%, 0);
      pointer-events: none;
      user-select: none;
      margin: 0;
      opacity: 0;
      @include useTheme {
        color: getTheme('background');
        background: getTheme('color');
      }

      &::after {
        content: '';
        position: absolute;
        top: calc(100% - 1px);
        left: 50%;
        $size: 1rem;
        width: $size;

        height: $size;

        @include useTheme {
          background: getTheme('color');
        }

        -webkit-clip-path: polygon(100% 0, 0 0, 50% 100%);
        clip-path: polygon(100% 0, 0 0, 50% 100%);
        transform: translate(-50%, 0);
      }
    }
  }
}
</style>
