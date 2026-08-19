import {
  clearSession,
  getToken,
} from './authStorage'

const API_URL = String(
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
).replace(/\/$/, '')

/**
 * Devuelve la ruta completa de login respetando import.meta.env.BASE_URL,
 * para que la redirección por 401 funcione también bajo un subpath.
 * Con BASE_URL '/' (o vacío) el resultado es '/login'.
 */
function getLoginPath() {
  const base = import.meta.env.BASE_URL || '/'
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`
  return `${baseWithSlash}login`
}

async function readResponse(
  response,
  {
    isAuthenticatedRequest = false,
    redirectOn401 = true,
  } = {},
) {
  let data = null

  try {
    data = await response.json()
  } catch {
    // Algunas respuestas, como archivos o errores de red, pueden no ser JSON.
  }

  if (!response.ok) {
    const error = new Error(
      data?.message
      || data?.msj
      || `La API respondió con el estado HTTP ${response.status}.`,
    )
    error.status = response.status

    // 401 en una llamada autenticada: el token venció o el usuario fue
    // desactivado/degradado. Siempre limpiamos la sesión; la redirección a
    // /login con window.location.assign (para no depender del router y evitar
    // dependencias circulares con useAuth) solo ocurre cuando redirectOn401
    // no está desactivado. Las llamadas que NO deben redirigir son:
    //   - getCurrentUser() (revalidación silenciosa de sesión al cargar la app;
    //     la navegación a rutas protegidas la decide el guard del router).
    //   - loginUser()/registerUser() (un 401 ahí son credenciales inválidas,
    //     no una sesión expirada).
    if (response.status === 401 && isAuthenticatedRequest) {
      clearSession()

      if (redirectOn401 !== false) {
        const loginPath = getLoginPath()

        if (window.location.pathname !== loginPath) {
          window.location.assign(loginPath)
        }
      }
    }

    throw error
  }

  return data
}

async function apiFetch(path, options = {}) {
  // redirectOn401 es una opción interna del cliente, no un atributo de fetch:
  // se extrae para no propagarla al RequestInit.
  const {
    redirectOn401 = true,
    ...fetchOptions
  } = options

  const headers = new Headers(fetchOptions.headers || {})

  const authToken = getToken()
  const isAuthenticatedRequest = Boolean(authToken)

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers,
    })

    return await readResponse(response, {
      isAuthenticatedRequest,
      redirectOn401,
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No fue posible conectarse con PixelVault API. '
        + 'Confirma que pixelvault-backend esté ejecutándose.',
      )
    }

    throw error
  }
}

function createProductFormData(product) {
  const formData = new FormData()
  const fields = [
    'name',
    'price',
    'platform',
    'category',
    'description',
    'status',
  ]

  for (const field of fields) {
    if (product[field] !== undefined && product[field] !== null) {
      formData.append(field, String(product[field]))
    }
  }

  for (const image of product.newImages || []) {
    formData.append('images', image)
  }

  if (product.removeImageIds?.length) {
    formData.append(
      'removeImageIds',
      JSON.stringify(product.removeImageIds),
    )
  }

  return formData
}

export async function getProducts({ includeInactive = false } = {}) {
  const query = includeInactive ? '?includeInactive=true' : ''
  const data = await apiFetch(`/products${query}`)
  return data.products || []
}

export async function createProduct(product) {
  const data = await apiFetch('/products', {
    method: 'POST',
    body: createProductFormData(product),
  })

  return data.product
}

export async function updateProduct(product) {
  const data = await apiFetch(`/products/${product.id}`, {
    method: 'PUT',
    body: createProductFormData(product),
  })

  return data.product
}

export async function updateProductStatus(productId, status) {
  const data = await apiFetch(`/products/${productId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  return data.product
}

export async function deactivateProduct(productId) {
  const data = await apiFetch(`/products/${productId}`, {
    method: 'DELETE',
  })

  return data.product
}

// --- Autenticación ---

export async function loginUser(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    // Un 401 aquí son credenciales inválidas, no una sesión expirada: no debe
    // redirigir/recargar aunque exista un token residual en storage.
    redirectOn401: false,
  })
}

export async function getCurrentUser() {
  // Revalidación silenciosa de sesión: ante 401 solo limpia la sesión (la
  // redirección de rutas protegidas la maneja el guard del router).
  return apiFetch('/auth/me', { redirectOn401: false })
}

// --- Usuarios ---

export async function registerUser({ name, email, password }) {
  return apiFetch('/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
    // 401 aquí son datos inválidos (p. ej. email ya registrado): no redirige.
    redirectOn401: false,
  })
}

export async function getUsers() {
  return apiFetch('/users')
}

export async function createAdminUser({ name, email, password }) {
  return apiFetch('/users/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })
}

export async function deactivateUser(userId) {
  return apiFetch(`/users/${userId}`, {
    method: 'DELETE',
  })
}

// --- Categorías ---

export async function getCategories({ includeInactive = false } = {}) {
  const query = includeInactive ? '?includeInactive=true' : ''
  return apiFetch(`/categories${query}`)
}

export async function createCategory(category) {
  return apiFetch('/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  })
}

export async function updateCategory(categoryId, category) {
  return apiFetch(`/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  })
}

export async function toggleCategoryStatus(categoryId, status) {
  return apiFetch(`/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
}

// --- Órdenes ---

export async function createOrder(orderPayload) {
  const data = await apiFetch('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderPayload),
  })

  return data.order
}

export async function getOrders() {
  return apiFetch('/orders')
}

export async function updateOrderStatus(orderId, status) {
  return apiFetch(`/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
}

export async function deleteOrder(orderId) {
  return apiFetch(`/orders/${orderId}`, {
    method: 'DELETE',
  })
}

export async function downloadOrderInvoice(orderId, filename) {
  // La descarga de la factura usa fetch directo (debe leer el body como blob,
  // no como JSON), pero igual envía el token JWT: el endpoint de factura está
  // protegido con requireAuth en el backend.
  const headers = {
    Accept: 'application/pdf',
  }
  const authToken = getToken()

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(
    `${API_URL}/orders/${orderId}/invoice`,
    { headers },
  )

  if (!response.ok) {
    let message = `La API respondió con el estado HTTP ${response.status}.`

    try {
      const data = await response.json()
      message = data?.message
        || data?.msj
        || message
    } catch {
      // La respuesta de error no es JSON (p. ej. una caída de red o un
      // proxy); se conserva el mensaje basado en el estado HTTP.
    }

    throw new Error(message)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(objectUrl)
}

export { API_URL }
