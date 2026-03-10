import { createRouter, createWebHistory } from 'vue-router';
import KMain from '@/views/KMain.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'arical',
      props: true,
      component: KMain,
    },
  ],
});

export default router;
