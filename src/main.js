import content from './content.js'
(() => {
    let lastValue={};
    function dfsContent(nowContent, parentList) {
        nowContent.list = parentList;
        lastValue.nextValue=nowContent
        lastValue=nowContent
        if (nowContent.subArticles) {
            for (let i in nowContent.subArticles) {
                dfsContent(nowContent.subArticles[i], parentList.concat([i]));
            }
        }
    }
    dfsContent(content,[])
})()

import './assets/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import './theme/theme.ts'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
