import './content.ts';

import '@/styles/main.scss';

import App from './App.vue';
import '@kuankuan/assist-2026/theme';
import router from './router';

const app = createApp(App);

app.use(router);

app.mount('#app');
