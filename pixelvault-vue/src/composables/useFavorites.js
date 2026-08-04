import { ref, watch } from 'vue'

const FAVORITES_STORAGE_KEY = 'pixelvault-favorites'

function loadFavorites() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedFavorites = JSON.parse(
      window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]',
    )

    if (!Array.isArray(storedFavorites)) {
      return []
    }

    return storedFavorites
      .map((productId) => Number(productId))
      .filter((productId) => Number.isInteger(productId))
  } catch (error) {
    console.error('No se pudieron leer los favoritos:', error)
    return []
  }
}

const favoriteProductIds = ref(loadFavorites())

watch(
  favoriteProductIds,
  (newFavorites) => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(newFavorites),
    )
  },
  {
    deep: true,
  },
)

export function useFavorites() {
  function isFavorite(productId) {
    return favoriteProductIds.value.includes(Number(productId))
  }

  function addFavorite(productId) {
    const normalizedId = Number(productId)

    if (!isFavorite(normalizedId)) {
      favoriteProductIds.value.push(normalizedId)
    }
  }

  function removeFavorite(productId) {
    favoriteProductIds.value = favoriteProductIds.value.filter((id) => {
      return id !== Number(productId)
    })
  }

  function toggleFavorite(productId) {
    if (isFavorite(productId)) {
      removeFavorite(productId)
      return false
    }

    addFavorite(productId)
    return true
  }

  return {
    favoriteProductIds,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}