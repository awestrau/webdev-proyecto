import {
  computed,
  readonly,
  ref,
} from 'vue'

import {
  getCurrentUser,
  loginUser,
} from '../services/api'
import {
  clearSession,
  getToken,
  getUser,
  saveSession,
  updateStoredUser,
} from '../services/authStorage'
import { withId } from '../utils/normalizeId'

// --- Estado a nivel de módulo (patrón de useProducts) ---
// Se restaura la sesión de forma síncrona desde el almacenamiento al cargar
// el módulo, para que el guard del router pueda decidir sin esperar la red.
const token = ref(getToken())
const currentUser = ref(withId(getUser()))
const authReady = ref(false)
const authError = ref('')

// Promesa única de revalidación: el guard del router y la carga del módulo
// esperan/ejecutan la misma init(), evitando llamadas duplicadas a /auth/me.
let initPromise = null

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'No fue posible completar la autenticación.'
}

/**
 * Revalida la sesión contra la API al iniciar la aplicación.
 * La restauración síncrona del módulo (token + usuario cacheado) ocurre
 * primero; la revalidación con GET /auth/me corre en segundo plano y refresca
 * el currentUser (detecta admins desactivados o degradados). Devuelve la misma
 * promesa para quien la invoque (guard del router, carga del módulo).
 */
async function init() {
  if (authReady.value) {
    return
  }

  if (!initPromise) {
    initPromise = revalidateSession().finally(() => {
      authReady.value = true
    })
  }

  return initPromise
}

/**
 * Si hay token en storage, pide el usuario actual a GET /auth/me y lo
 * actualiza (en memoria y en caché). Si el token es inválido (401), limpia la
 * sesión y queda sin usuario. Los errores de red no cierran la sesión: se
 * conserva el usuario cacheado para no desloguear por una caída del backend.
 */
async function revalidateSession() {
  if (!token.value) {
    return
  }

  try {
    const data = await getCurrentUser()
    currentUser.value = withId(data.user)
    updateStoredUser(currentUser.value)
  } catch (error) {
    if (error?.status === 401) {
      clearSession()
      token.value = ''
      currentUser.value = null
    }
  }
}

/**
 * Inicia sesión contra la API y persiste la sesión.
 * @param {string} email
 * @param {string} password
 * @param {{ persist?: boolean }} options  persist=true → localStorage
 *   (Recordarme), persist=false → sessionStorage (solo esta pestaña).
 * @returns {Promise<object>} El usuario autenticado.
 */
async function login(email, password, { persist = true } = {}) {
  authError.value = ''

  try {
    const data = await loginUser(email, password)
    const user = withId(data.user)
    saveSession(data.token, user, persist)
    token.value = data.token
    currentUser.value = user
    return user
  } catch (error) {
    authError.value = getErrorMessage(error)
    throw error
  }
}

function logout() {
  clearSession()
  token.value = ''
  currentUser.value = null
  authError.value = ''
}

function clearAuthError() {
  authError.value = ''
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(token.value))
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  return {
    currentUser: readonly(currentUser),
    token: readonly(token),
    isAuthenticated,
    isAdmin,
    authReady: readonly(authReady),
    authError: readonly(authError),
    init,
    login,
    logout,
    clearAuthError,
  }
}

// Al cargar el módulo se valida la sesión guardada en segundo plano.
init().catch(() => {
  // El fallo de red se resuelve en silencio; las vistas muestran sus errores.
})
