import {
  computed,
  readonly,
  ref,
} from 'vue'

import {
  createProduct as createProductRequest,
  deactivateProduct as deactivateProductRequest,
  getProducts,
  updateProduct as updateProductRequest,
  updateProductStatus as updateProductStatusRequest,
} from '../services/api'

const catalogProducts = ref([])
const loadingProducts = ref(false)
const productsError = ref('')
const productsLoaded = ref(false)

let loadingRequest = null

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'No fue posible completar la operación con productos.'
}

function replaceProduct(updatedProduct) {
  const index = catalogProducts.value.findIndex((product) => {
    return String(product.id) === String(updatedProduct.id)
  })

  if (index === -1) {
    catalogProducts.value.unshift(updatedProduct)
    return
  }

  catalogProducts.value[index] = updatedProduct
}

async function loadProducts({ force = false } = {}) {
  if (productsLoaded.value && !force) {
    return catalogProducts.value
  }

  if (loadingRequest && !force) {
    return loadingRequest
  }

  loadingProducts.value = true
  productsError.value = ''

  loadingRequest = getProducts({ includeInactive: true })
    .then((products) => {
      catalogProducts.value = products
      productsLoaded.value = true
      return products
    })
    .catch((error) => {
      productsError.value = getErrorMessage(error)
      throw error
    })
    .finally(() => {
      loadingProducts.value = false
      loadingRequest = null
    })

  return loadingRequest
}

async function addProduct(productData) {
  productsError.value = ''

  try {
    const product = await createProductRequest(productData)
    catalogProducts.value.unshift(product)
    return product
  } catch (error) {
    productsError.value = getErrorMessage(error)
    throw error
  }
}

async function updateProduct(productData) {
  productsError.value = ''

  try {
    const product = await updateProductRequest(productData)
    replaceProduct(product)
    return product
  } catch (error) {
    productsError.value = getErrorMessage(error)
    throw error
  }
}

async function setProductStatus(productId, status) {
  productsError.value = ''

  try {
    const product = await updateProductStatusRequest(productId, status)
    replaceProduct(product)
    return product
  } catch (error) {
    productsError.value = getErrorMessage(error)
    throw error
  }
}

async function removeProduct(productId) {
  productsError.value = ''

  try {
    const product = await deactivateProductRequest(productId)
    replaceProduct(product)
    return product
  } catch (error) {
    productsError.value = getErrorMessage(error)
    throw error
  }
}

function clearProductsError() {
  productsError.value = ''
}

function getUniqueValues(products, field) {
  return [
    ...new Set(
      products
        .map((product) => product[field])
        .filter(Boolean),
    ),
  ].sort((first, second) => {
    return first.localeCompare(second, 'es', {
      sensitivity: 'base',
    })
  })
}

export function useProducts() {
  const products = computed(() => {
    return catalogProducts.value.filter((product) => product.status !== false)
  })

  const allProducts = readonly(catalogProducts)
  const categories = computed(() => {
    return getUniqueValues(products.value, 'category')
  })
  const platforms = computed(() => {
    return getUniqueValues(products.value, 'platform')
  })
  const allCategories = computed(() => {
    return getUniqueValues(catalogProducts.value, 'category')
  })
  const allPlatforms = computed(() => {
    return getUniqueValues(catalogProducts.value, 'platform')
  })

  return {
    products,
    allProducts,
    categories,
    platforms,
    allCategories,
    allPlatforms,
    loadingProducts: readonly(loadingProducts),
    productsError: readonly(productsError),
    productsLoaded: readonly(productsLoaded),
    loadProducts,
    addProduct,
    updateProduct,
    setProductStatus,
    removeProduct,
    clearProductsError,
  }
}
