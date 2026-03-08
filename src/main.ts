import './content.ts';

import '@/styles/main.scss';

import App from './App.vue';
import './theme/theme.ts';
import router from './router';

const app = createApp(App);

app.use(router);

app.mount('#app');
