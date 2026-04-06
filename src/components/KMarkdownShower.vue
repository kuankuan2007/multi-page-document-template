<template>
  <div class="shower-root">
    <div v-html="show" ref="shower" class="shower" @click="handleClick"></div>
  </div>
</template>
<script setup lang="ts">
import data from '@/assets/fontello/data';
import showdown from 'showdown';
import hljs from 'highlight.js';
import showdownKatex from 'showdown-katex';

const router=useRouter();

const props = withDefaults(
  defineProps<{
    headerLevelStart?: number;
    content: string;
  }>(),
  {
    headerLevelStart: 1,
  }
);
const copyText = (() =>
  window.navigator?.clipboard?.writeText
    ? (text: string) => window.navigator.clipboard.writeText(text)
    : (text: string) => {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      })();
function handleClick(event: MouseEvent) {
  if (event.button !== 0) return;
  const target = event.target as HTMLElement;
  if (!target) return;
  if (target.tagName === 'BUTTON' && target.classList.contains('copy-button')) {
    copyCode(target as HTMLButtonElement);
  }else if (target.tagName === 'A') {
    handleLink(target as HTMLAnchorElement, event);
  }
}
function handleLink(target: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented) return;
  if (target.target && target.target !== '_self') return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (target.hasAttribute('download')) return;

  const href = target.getAttribute('href');
  if (!href) return;
  const fullUrl = new URL(href, window.location.href.endsWith('/') ? window.location.href : window.location.href + '/');
  if (fullUrl.origin !== window.location.origin) return;

  event.preventDefault();
  router.push(fullUrl.pathname + fullUrl.search);
}
function copyCode(target: HTMLButtonElement) {
  if (target.dataset.code) copyText(target.dataset.code);
  if (!target.parentElement) return;
  const tipEle = target.parentElement.querySelector('.tip') as HTMLElement;
  if (tipEle) {
    tipEle.innerText = String.fromCharCode(data['tick']);
    tipEle.classList.add('demo-icon');
    setTimeout(() => {
      tipEle.innerText = '复制';
      tipEle.classList.remove('demo-icon');
    }, 3000);
  }
}

const converter = new showdown.Converter({
  parseImgDimensions: true,
  headerLevelStart: props.headerLevelStart,
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  simpleLineBreaks: true,
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
    const copyArea = document.createElement('div');
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    const tip = document.createElement('div');
    copyButton.innerText = String.fromCharCode(data['copy']);
    tip.innerText = '复制';
    tip.classList.add('tip');
    copyButton.classList.add('copy-button');
    copyButton.classList.add('demo-icon');
    copyButton.dataset.code = codeEle.innerText;
    copyArea.classList.add('copy-area');
    copyArea.appendChild(copyButton);
    copyArea.appendChild(tip);
    i.appendChild(copyArea);
  }
  return tempEle.innerHTML;
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
    @include motion.transition(0.3s);
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
    @include motion.transition(0.3s);
    position: relative;

    &::before {
      content: 'math';
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 0.3em;
      pointer-events: none;
      font-weight: normal;
      @include motion.transition(0.3s);
      padding: 0.2rem 0.5rem;
      height: 16px;
      line-height: 16px;

      @include theme.use {
        background: rgba(theme.get('background'), 0.5);
      }
    }
  }

  code {
    @include motion.transition(0.3s);
    font-family: 'Fira Code', 'Monaspace Neon', sans-serif;
    font-weight: lighter;
    font-size: 1em;
    cursor: text;
  }

  code * {
    @include motion.transition(0.3s);
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
    @include motion.transition(0.3s);
    padding: 0.2rem 0.5rem;
    height: 16px;
    line-height: 16px;

    @include theme.use {
      background: rgba(theme.get('background'), 0.5);
    }
  }

  pre {
    position: relative;
  }
  .copy-area {
    position: absolute;
    top: 0px;
    right: 0px;
    .tip {
      @include fontello.fontello;
      position: absolute;
      padding: 0.5rem;
      top: -1rem;
      left: 50%;
      transform: translate(-50%, 0);
      pointer-events: none;
      user-select: none;
      margin: 0;
      opacity: 0;
      @include theme.use {
        color: theme.get('background');
        background: theme.get('color');
      }

      &::after {
        content: '';
        position: absolute;
        top: calc(100% - 1px);
        left: 50%;
        $size: 1rem;
        width: $size;

        height: $size;

        @include theme.use {
          background: theme.get('color');
        }

        -webkit-clip-path: polygon(100% 0, 0 0, 50% 100%);
        clip-path: polygon(100% 0, 0 0, 50% 100%);
        transform: translate(-50%, 0);
      }
    }
    .copy-button {
      @include fontello.fontello;
      padding: 0.15rem;
      margin: 0;
      font-size: 1em;
      border-width: 0.06rem;
      border-style: solid;
      border-color: transparent;
      cursor: pointer;
      @include motion.transition(0.3s);
      user-select: none;

      @include theme.use {
        background: theme.mix('background', 'color', 85%, 0.5);
        color: theme.get('color');
      }

      &:hover {
        @include theme.use {
          color: theme.mix('active-color', 'color', 85%);
          border-color: theme.mix('active-color', 'color', 85%);
        }

        & + .tip {
          opacity: 1;
          transform: translate(-50%, -100%);
        }
      }
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &::before {
      opacity: 0.2;
    }
  }

  @function repeat-character($char, $times) {
    $result: '';

    @for $i from 1 through $times {
      $result: #{$result}#{$char};
    }

    @return '#{$result}';
  }

  @for $i from 1 through 6 {
    h#{$i} {
      &::before {
        padding-right: #{0.2rem + (6-$i) * 0.1rem};
        content: repeat-character('#', $i);
      }
    }
  }

  blockquote {
    margin: 0 0 0 0.5rem;
    padding: 1px 0 1px 0.5rem;

    & p {
      margin: 0.5rem 0 0.5rem 0;
    }

    @include theme.use {
      background: rgba(theme.get('color'), 0.05);
      border-left: 0.5rem solid rgba(theme.get('color'), 0.3);
    }
  }
}
</style>
