import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegistroView from '@/views/RegistroView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: {
      name: 'products',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView,
  },
  {
    path: '/products',
    name: 'products',
    component: () => {
      return import('../views/ProductListView.vue')
    },
  },
  {
    path: '/producto/:id',
    name: 'product-detail',
    component: () => {
      return import('../views/ProductDetailView.vue')
    },
  },
  {
    path: '/mi_carrito',
    name: 'cart',
    component: () => {
      return import('../views/MiCarritoView.vue')
    },
  },
  {
    path: '/guardados',
    name: 'favorites',
    component: () => {
      return import('../views/FavoriteProductView.vue')
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
