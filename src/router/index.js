import { createRouter, createWebHistory } from 'vue-router'
import KArticle from '@/views/KArticle.vue'
import KContent from '@/views/KContent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'arical',
      props: true,
      components:{
        content: KContent,
        article: KArticle
      }
    },
  ]
})

export default router
