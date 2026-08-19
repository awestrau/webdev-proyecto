import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegistroView from '@/views/RegistroView.vue'

import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
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
    path: '/admin-portal',
    name: 'admin-portal',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    component: () => {
      return import('../views/AdminPortalView.vue')
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

function isAdminPath(path) {
  return path === '/admin-portal' || path.startsWith('/admin-portal')
}

router.beforeEach(async (to) => {
  const {
    isAuthenticated,
    isAdmin,
    authReady,
    init,
  } = useAuth()

  // Espera a que la sesión esté resuelta (restauración síncrona del storage +
  // revalidación con GET /auth/me) antes de evaluar isAuthenticated/isAdmin.
  // El módulo de useAuth ya arranca esa revalidación en segundo plano, así que
  // aquí solo se espera la misma promesa (sin llamadas duplicadas). Si el
  // token venció y la revalidación lo detecta (401), la sesión se limpia y un
  // admin redirigido cae en /login, no en la home (evita bucles).
  if (!authReady.value) {
    await init()
  }

  // Rutas que exigen ser administrador.
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated.value) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    if (!isAdmin.value) {
      // Usuario con sesión pero sin permisos: lo enviamos a la home
      // (sin query de redirect) para evitar bucles de redirección.
      return { path: '/' }
    }
  }

  // Un usuario con sesión no debería ver la página de login.
  if (to.name === 'login' && isAuthenticated.value) {
    const redirect = to.query.redirect

    if (
      typeof redirect === 'string'
      && redirect.startsWith('/')
      && redirect !== '/login'
    ) {
      // Si el destino es administrativo, validamos el rol para no caer
      // en un bucle entre /admin-portal y /login.
      if (isAdminPath(redirect) && !isAdmin.value) {
        return { path: '/' }
      }

      return { path: redirect }
    }

    return { path: '/' }
  }

  return true
})

export default router
