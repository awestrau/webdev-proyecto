<script setup>
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
} from 'vue'

import ProductFilter from '../components/products/ProductFilter.vue'
import ProductList from '../components/products/ProductList.vue'

import { useCart } from '../composables/useCart'
import { useFavorites } from '../composables/useFavorites'
import { useProductFilters } from '../composables/useProductFilters'
import { useProducts } from '../composables/useProducts'
import { productMatchesSearch } from '../utils/productSearch'

const feedbackMessage = ref('')
const feedbackType = ref('success')

let feedbackTimer = null

const {
    products,
    categories: availableCategories,
    platforms: availablePlatforms,
    loadingProducts,
    productsError,
    loadProducts,
} = useProducts()

const {
    addToCart,
} = useCart(products)

const {
    favoriteProductIds,
    toggleFavorite,
} = useFavorites()

const {
    searchText,
    selectedCategory,
    selectedPlatform,
    hasActiveFilters,
    clearFilters,
} = useProductFilters()

const filteredProducts = computed(() => {
    return products.value.filter((product) => {
        const matchesSearch = productMatchesSearch(
            product,
            searchText.value,
        )

        const matchesCategory =
            !selectedCategory.value
            || product.category === selectedCategory.value

        const matchesPlatform =
            !selectedPlatform.value
            || product.platform === selectedPlatform.value

        return (
            matchesSearch
            && matchesCategory
            && matchesPlatform
        )
    })
})

function showFeedback(message, type = 'success') {
    feedbackMessage.value = message
    feedbackType.value = type

    if (feedbackTimer) {
        window.clearTimeout(feedbackTimer)
    }

    feedbackTimer = window.setTimeout(() => {
        feedbackMessage.value = ''
    }, 3500)
}

function addProductToCart(productId) {
    const selectedProduct = products.value.find((product) => {
        return String(product.id) === String(productId)
    })

    if (!selectedProduct) {
        showFeedback(
            'No fue posible encontrar el producto.',
            'danger',
        )
        return
    }

    const added = addToCart(selectedProduct.id)

    if (added) {
        showFeedback(
            `${selectedProduct.name} se agregó al carrito.`,
        )
    }
}

function toggleProductFavorite(productId) {
    const selectedProduct = products.value.find((product) => {
        return String(product.id) === String(productId)
    })

    if (!selectedProduct) {
        return
    }

    const wasAdded = toggleFavorite(selectedProduct.id)

    showFeedback(
        wasAdded
            ? `${selectedProduct.name} se agregó a favoritos.`
            : `${selectedProduct.name} se eliminó de favoritos.`,
    )
}

onBeforeUnmount(() => {
    if (feedbackTimer) {
        window.clearTimeout(feedbackTimer)
    }
})

onMounted(() => {
    loadProducts().catch(() => {})
})

function retryProducts() {
    loadProducts({ force: true }).catch(() => {})
}
</script>

<template>
    <main class="product-list-page flex-grow-1 py-4 py-md-5">
        <div class="container-fluid product-list-container">
            <ProductFilter v-if="!loadingProducts && !productsError"
                :categories="availableCategories" :platforms="availablePlatforms"
                :search-text="searchText" :selected-category="selectedCategory"
                :selected-platform="selectedPlatform" :has-active-filters="hasActiveFilters"
                :result-count="filteredProducts.length"
                @update:selected-category="selectedCategory = $event"
                @update:selected-platform="selectedPlatform = $event" @clear-filters="clearFilters" />

            <section class="products-panel nes-container is-rounded" aria-labelledby="products-title">
                <div class="d-flex flex-wrap align-items-baseline
                 justify-content-between gap-3 mb-4 mb-md-5">
                    <h1 id="products-title" class="m-0 fs-2">
                        Productos de PixelVault
                    </h1>

                    <span class="products-count" aria-live="polite">
                        {{ filteredProducts.length }}
                        {{
                            filteredProducts.length === 1
                                ? 'producto'
                                : 'productos'
                        }}
                    </span>
                </div>

                <div v-if="feedbackMessage" class="alert mb-4" :class="`alert-${feedbackType}`" role="status"
                    aria-live="polite">
                    {{ feedbackMessage }}
                </div>

                <div v-if="loadingProducts" class="products-state text-center py-5" role="status">
                    Cargando productos desde la API...
                </div>

                <div v-else-if="productsError" class="alert alert-danger" role="alert">
                    <p class="mb-3">{{ productsError }}</p>
                    <button class="nes-btn is-primary" type="button" @click="retryProducts">
                        Reintentar
                    </button>
                </div>

                <ProductList v-else :products="filteredProducts" :favorite-product-ids="favoriteProductIds"
                    @add-to-cart="addProductToCart" @toggle-favorite="toggleProductFavorite" />
            </section>
        </div>
    </main>
</template>

<style scoped>
.product-list-page {
    background-color: #fff;
    color: #151515;
}

.product-list-container {
    max-width: 1500px;
}

.products-panel {
    min-height: 650px;
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.products-panel h1 {
    font-family: 'Press Start 2P', cursive;
    font-size: 1rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.products-count {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.65rem;
    color: #1a1f1f;
    background-color: #feb914;
    border: 3px solid #111;
    box-shadow: 3px 3px 0 #111;
    padding: 0.45rem 0.65rem;
}

.products-state {
    font-size: 0.68rem;
    line-height: 1.8;
}

@media (min-width: 1200px) {
    .products-panel {
        padding-inline: 2.5rem;
    }
}
</style>
