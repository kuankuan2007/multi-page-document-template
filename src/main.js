import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import './theme/theme.ts'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
