import { computed, ref } from 'vue'

const MAX_SEARCH_LENGTH = 60

const searchText = ref('')
const selectedCategory = ref('')
const selectedPlatform = ref('')
const searchError = ref('')

/*
 * El estado se declara fuera de la función para que AppHeader y
 * ProductListView utilicen la misma instancia reactiva.
 */
function setSearchText(value) {
  const rawValue = String(value ?? '')

  /*
   * Se permiten:
   * - Letras con y sin tilde
   * - Números
   * - Espacios
   * - Caracteres comunes en nombres de productos
   */
  const sanitizedValue = rawValue
    .replace(/[^\p{L}\p{N}\s'’:&+.\-]/gu, '')
    .replace(/\s{2,}/g, ' ')

  if (rawValue !== sanitizedValue) {
    searchError.value =
      'La búsqueda contiene caracteres que no están permitidos.'
  } else if (sanitizedValue.length > MAX_SEARCH_LENGTH) {
    searchError.value =
      `La búsqueda no puede superar ${MAX_SEARCH_LENGTH} caracteres.`
  } else {
    searchError.value = ''
  }

  searchText.value = sanitizedValue.slice(0, MAX_SEARCH_LENGTH)
}

function clearSearch() {
  searchText.value = ''
  searchError.value = ''
}

function clearFilters() {
  clearSearch()
  selectedCategory.value = ''
  selectedPlatform.value = ''
}

const hasActiveFilters = computed(() => {
  return Boolean(
    searchText.value
    || selectedCategory.value
    || selectedPlatform.value,
  )
})

export function useProductFilters() {
  return {
    searchText,
    searchError,
    selectedCategory,
    selectedPlatform,
    hasActiveFilters,
    setSearchText,
    clearSearch,
    clearFilters,
  }
}