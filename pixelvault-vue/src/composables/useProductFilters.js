import { computed, ref } from 'vue'

import { sanitizeProductSearch } from '../utils/productSearch'

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
  const sanitizedSearch = sanitizeProductSearch(rawValue)

  searchError.value = sanitizedSearch.error
  searchText.value = sanitizedSearch.value
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
