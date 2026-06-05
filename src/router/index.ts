import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/Landing.vue')
  },
  {
    path: '/characters',
    name: 'characters',
    component: () => import('@/views/CharacterSelect.vue')
  },
  {
    path: '/explore/:characterId',
    name: 'explore',
    component: () => import('@/views/ImmersiveExplore.vue')
  },
  {
    path: '/graph',
    name: 'graph',
    component: () => import('@/views/RelationGraph.vue')
  },
  {
    path: '/reflection',
    name: 'reflection',
    component: () => import('@/views/Reflection.vue')
  },
  {
    path: '/memory-board',
    name: 'memory-board',
    component: () => import('@/views/MemoryBoard.vue')
  },
  {
    path: '/interactive-game',
    name: 'interactive-game',
    component: () => import('@/views/InteractiveGame.vue')
  },
  {
    path: '/ending',
    name: 'ending',
    component: () => import('@/views/Ending.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
