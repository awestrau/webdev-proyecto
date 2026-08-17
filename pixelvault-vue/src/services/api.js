const API_URL = String(
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
).replace(/\/$/, '')

async function readResponse(response) {
  let data = null

  try {
    data = await response.json()
  } catch {
    // Algunas respuestas, como archivos o errores de red, pueden no ser JSON.
  }

  if (!response.ok) {
    throw new Error(
      data?.message
      || data?.msj
      || `La API respondió con el estado HTTP ${response.status}.`,
    )
  }

  return data
}

async function apiFetch(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, options)
    return await readResponse(response)
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

export { API_URL }
