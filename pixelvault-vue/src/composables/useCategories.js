import {
  computed,
  readonly,
  ref,
} from 'vue'

import {
  createCategory as createCategoryRequest,
  getCategories,
  toggleCategoryStatus as toggleCategoryStatusRequest,
  updateCategory as updateCategoryRequest,
} from '../services/api'

import { withId } from '../utils/normalizeId'

// --- Estado a nivel de módulo (patrón de useProducts) ---
// Estas categorías vienen de GET /api/categories (gestión real), y NO se
// mezclan con las categorías de la tienda que se derivan de los productos.
const categories = ref([])
const loadingCategories = ref(false)
const categoriesError = ref('')
const categoriesLoaded = ref(false)

let loadingRequest = null

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'No fue posible completar la operación con categorías.'
}

function replaceCategory(updatedCategory) {
  const index = categories.value.findIndex((category) => {
    return String(category.id) === String(updatedCategory.id)
  })

  if (index === -1) {
    categories.value.unshift(updatedCategory)
    return
  }

  categories.value[index] = updatedCategory
}

async function loadCategories({ force = false } = {}) {
  if (categoriesLoaded.value && !force) {
    return categories.value
  }

  if (loadingRequest && !force) {
    return loadingRequest
  }

  loadingCategories.value = true
  categoriesError.value = ''

  loadingRequest = getCategories({ includeInactive: true })
    .then((data) => {
      categories.value = (data.categories || []).map(withId)
      categoriesLoaded.value = true
      return categories.value
    })
    .catch((error) => {
      categoriesError.value = getErrorMessage(error)
      throw error
    })
    .finally(() => {
      loadingCategories.value = false
      loadingRequest = null
    })

  return loadingRequest
}

async function createCategory(categoryData) {
  categoriesError.value = ''

  try {
    const data = await createCategoryRequest(categoryData)

    if (data.category) {
      categories.value.unshift(withId(data.category))
    }

    return data.category
  } catch (error) {
    categoriesError.value = getErrorMessage(error)
    throw error
  }
}

async function updateCategory(categoryData) {
  categoriesError.value = ''

  try {
    const { id, ...fields } = categoryData
    const data = await updateCategoryRequest(id, fields)

    if (data.category) {
      replaceCategory(withId(data.category))
    }

    return data.category
  } catch (error) {
    categoriesError.value = getErrorMessage(error)
    throw error
  }
}

async function setCategoryStatus(categoryId, status) {
  categoriesError.value = ''

  try {
    const data = await toggleCategoryStatusRequest(categoryId, status)

    if (data.category) {
      replaceCategory(withId(data.category))
    }

    return data.category
  } catch (error) {
    categoriesError.value = getErrorMessage(error)
    throw error
  }
}

function clearCategoriesError() {
  categoriesError.value = ''
}

export function useCategories() {
  const activeCategories = computed(() => {
    return categories.value.filter((category) => category.status !== false)
  })

  return {
    categories: readonly(categories),
    activeCategories,
    loadingCategories: readonly(loadingCategories),
    categoriesError: readonly(categoriesError),
    categoriesLoaded: readonly(categoriesLoaded),
    loadCategories,
    createCategory,
    updateCategory,
    setCategoryStatus,
    clearCategoriesError,
  }
}
