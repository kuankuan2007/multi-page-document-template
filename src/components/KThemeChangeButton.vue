<template>
    <div @click="onClick" class="theme-icon" v-html="themeConfigs[theme].icon"></div>
</template>
<script setup>
import { themeConfigs, getTheme,changeTheme} from '../theme/theme.ts'
import { ref } from "vue"


console.log(themeConfigs)
const theme=ref('')
getTheme((t)=>{
    theme.value=t
})
function onClick(){
    const keys=Object.keys(themeConfigs)
    changeTheme(keys[(keys.indexOf(theme.value)+1)%keys.length])
}
</script>
<style scoped lang="scss">

.theme-icon{
    height: 30px;
    &:deep(svg){
        cursor: pointer;
        height: 100%;
        &>*{
            @include useTheme{
                fill: getTheme('color');
                stroke: getTheme('color');
            }
        }
    }
}
</style>