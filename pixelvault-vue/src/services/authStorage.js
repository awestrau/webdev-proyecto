/**
 * Persistencia de la sesión de PixelVault.
 *
 * El token y el usuario se guardan en localStorage (sesión persistente,
 * "Recordarme") o en sessionStorage (sesión por pestaña). Los helpers leen
 * primero de localStorage y luego de sessionStorage, por lo que apiFetch puede
 * obtener el token sin depender de composables (evita dependencias circulares).
 */

const TOKEN_KEY = 'pixelvault_token'
const USER_KEY = 'pixelvault_user'

function getStore(persist) {
  return persist ? window.localStorage : window.sessionStorage
}

/**
 * Devuelve el token guardado (localStorage o sessionStorage), o '' si no hay.
 */
export function getToken() {
  return (
    window.localStorage.getItem(TOKEN_KEY)
    || window.sessionStorage.getItem(TOKEN_KEY)
    || ''
  )
}

/**
 * Devuelve el usuario en caché, o null si no existe o no es JSON válido.
 */
export function getUser() {
  const raw = (
    window.localStorage.getItem(USER_KEY)
    || window.sessionStorage.getItem(USER_KEY)
  )

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Guarda (o sobrescribe) la sesión en el almacén indicado.
 * @param {string} token  Token JWT.
 * @param {object|null} user  Datos del usuario autenticado.
 * @param {boolean} persist  true → localStorage, false → sessionStorage.
 */
export function saveSession(token, user, persist = true) {
  clearSession()

  const store = getStore(persist)
  store.setItem(TOKEN_KEY, token)

  if (user) {
    store.setItem(USER_KEY, JSON.stringify(user))
  }
}

/**
 * Actualiza el usuario en caché en el mismo almacén donde está el token.
 * Se usa al revalidar la sesión con GET /auth/me.
 */
export function updateStoredUser(user) {
  const token = getToken()

  if (!token || !user) {
    return
  }

  const persist = window.localStorage.getItem(TOKEN_KEY) === token
  getStore(persist).setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Elimina la sesión de ambos almacenes.
 */
export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
  window.sessionStorage.removeItem(TOKEN_KEY)
  window.sessionStorage.removeItem(USER_KEY)
}
