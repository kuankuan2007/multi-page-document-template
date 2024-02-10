<template>
    <div class="content-line" :class="{
        fold: nowFold
    }">
        <p class="title">
            <router-link :class="{
                selected: props.select,
            }" :to="'/' + props.parents.join('/')">{{ props.data.title }}</router-link>
            <k-icon @click="changeFold = !changeFold" v-if="props.data.subArticles" name="arrow-down" class="button" />
        </p>
        <k-auto-height-folding ref="autoHeightFolding" :fold="nowFold" v-if="props.data.subArticles">
            <ul>
                <k-content-component @k-upgrade-height="() => { autoHeightFolding && autoHeightFolding.refreshHeight(), emit('k-upgrade-height') }"
                    v-for="subArticle, subArticleName in props.data.subArticles" :data="subArticle"
                    :path-tree="pathTree.slice(1)" :parents="subArticleParents(subArticleName)"
                    :fold="(pathTree[0] === subArticleName && pathTree.length === 1) || pathTree[0] !== subArticleName"
                    :select="pathTree.length === 1 && pathTree[0] === subArticleName" />
            </ul>
        </k-auto-height-folding>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { computed, ref, watchEffect } from 'vue';
import KIcon from './KIcon.vue';
import KContentComponent from './KContentComponent.vue'
import KAutoHeightFolding from './KAutoHeightFolding.vue';
const props = defineProps({
    data: {
        type: Object,
        required: true
    }, pathTree: {
        type: Array,
        default: false,
    }, fold: {
        type: Boolean,
        default: true,
        required: false
    }, select: {
        type: Boolean,
        default: false,
        required: false
    }, parents: {
        type: Array,
        default: [],
        required: false
    }
})
const autoHeightFolding = ref(null)
const changeFold = ref(false)
const nowFold = computed(() => {
    if (changeFold.value) {
        return !props.fold
    }
    return props.fold
})
watchEffect(() => {
    props.fold
    changeFold.value = false
})
function subArticleParents(name) {
    return props.parents.concat([name])
}

</script>
<style scoped lang="scss">
@import "../theme/theme.scss";

.selected {
    @include useTheme {
        color: getTheme('color');
    }

    background-color: transparent;
    background-image: none;
    cursor: default;
}

.title {
    display: flex;
    margin: 0.5rem;
}

.button {
    cursor: pointer;
    border: solid 2px transparent;
    border-radius: 999px;
    padding: 2px;
    display: block;

    &:hover {
        @include useTheme {
            border-color: getTheme('color');
        }
    }

    .fold>.title>& {
        transform: rotate(-90deg);
    }
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-left: 2rem;
    padding-left: 0.5rem;
    border-left-width: 1px;
    border-left-style: solid;

    @include useTheme {
        border-left-color: rgba(getTheme("color"), 0.3);
    }
}
</style>