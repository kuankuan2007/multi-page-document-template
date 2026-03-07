<template>
    <div v-html="show" ref="shower" class="shower"></div>
</template>
<script setup>
let props = defineProps({
    headerLevelStart: {
        type: Number,
        default: 1,
        required: false
    }, content: {
        type: String,
        default: "",
        required: true
    }
})
import showdown from "showdown"
import { computed, ref, onMounted } from "vue";
import hljs from 'highlight.js';
import showdownKatex from "showdown-katex";

const emit = defineEmits(["contentChanged"])
function copyText(text) {
    return navigator.clipboard.writeText(text);
}
onMounted(() => {
    shower.value.addEventListener("click", copyCode)
})

let converter = new showdown.Converter({
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
            output: "html",
            delimiters: [
                { left: "$", right: "$", display: false }
            ],
        })
    ]
})
let shower = ref(null)
/**
 * 
 * @param {MouseEvent} event 
 */
function copyCode(event) {
    if ("code" in event.target.dataset) {
        copyText(event.target.dataset.code)
        event.target.firstChild.innerText = '\ue802'
        event.target.firstChild.classList.add("demo-icon")
        setTimeout(() => {
            event.target.firstChild.innerText = '点击复制'
            event.target.firstChild.classList.remove("demo-icon")
        }, 3000)
    }
}
function makeHtml(markdown) {
    return converter.makeHtml(markdown)
}
let show = computed(() => {
    let html = makeHtml(props.content)
    let tempEle = document.createElement("div")
    tempEle.innerHTML = html
    let codeBlocks = new Array(...tempEle.querySelectorAll("code"))
    for (let i = 0; i < codeBlocks.length; i++) {
        hljs.highlightElement(codeBlocks[i])
    }
    let codeBlocksPre = (new Array(...tempEle.querySelectorAll("pre>code.hljs"))).map((ele) => {
        return ele.parentElement
    })
    for (let i = 0; i < codeBlocksPre.length; i++) {
        let ele = codeBlocksPre[i]
        let code = ele.querySelector("code.hljs")
        for (let j = 0; j < code.classList.length; j++) {
            if (code.classList[j].startsWith('language-')) {
                code.style.setProperty("--language", `"${code.classList[j].slice(9)}"`)
            }
        }
        const copy = document.createElement("div")
        const tip = document.createElement("div")
        copy.innerText = "\uf0c5"
        tip.innerText = "点击复制"
        tip.classList.add("tip")
        copy.classList.add("copy-button")
        copy.classList.add("demo-icon")
        copy.dataset.code = code.innerText
        copy.insertBefore(tip, copy.firstChild)
        ele.appendChild(copy)
    }
    html = tempEle.innerHTML
    Promise.resolve().then(() => { emit("contentChanged", html) })
    return html
})

defineExpose({
    showBox: shower,
    makeHtml
})
</script>
<style lang="scss">
@use 'sass:meta';
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
        content: "math";
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
            background: rgba(getTheme("background"), 0.5);
        }
    }
}

code {
    transition: 0.3s;
    font-family: system-ui;
    font-weight: lighter;
    font-size: 0.8em;
    cursor: text;
}

code * {
    transition: 0.3s;
}

pre>code.hljs {
    position: relative;
    padding-top: 1.6rem !important;
}

pre>code::before {
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
        background: rgba(getTheme("background"), 0.5);
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
        background: rgba(getTheme("background"), 0.5);
        color: getTheme("link-color");
    }

    &:hover {
        @include useTheme {
            color: getTheme("link-hover-color");
            border-color: getTheme("link-hover-color");
        }

        &>.tip {
            opacity: 1;
            transform: translate(-50%, -100%);
        }
    }

    &>.tip {
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
            color: getTheme("background");
            background: getTheme("color");
        }

        &::after {
            content: "";
            position: absolute;
            top: calc(100% - 1px);
            left: 50%;
            $size: 1rem;
            width: $size;
            
            height: $size;

            @include useTheme {
                background: getTheme("color");
            }


            -webkit-clip-path: polygon(100% 0, 0 0, 50% 100%);
            clip-path: polygon(100% 0, 0 0, 50% 100%);
            transform: translate(-50%, 0);
        }
    }
}
</style>