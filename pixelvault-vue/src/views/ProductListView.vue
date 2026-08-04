<script setup>
import {
    computed,
    onBeforeUnmount,
    ref,
} from 'vue'

import ProductFilter from '../components/products/ProductFilter.vue'
import ProductList from '../components/products/ProductList.vue'

import { useCart } from '../composables/useCart'
import { useFavorites } from '../composables/useFavorites'
import { useProductFilters } from '../composables/useProductFilters'

import products from '../data/products.json'

const feedbackMessage = ref('')
const feedbackType = ref('success')

let feedbackTimer = null

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
} = useProductFilters()

const availableCategories = computed(() => {
    return [...new Set(
        products.map((product) => product.category),
    )].sort((first, second) => {
        return first.localeCompare(second, 'es', {
            sensitivity: 'base',
        })
    })
})

const availablePlatforms = computed(() => {
    return [...new Set(
        products.map((product) => product.platform),
    )].sort((first, second) => {
        return first.localeCompare(second, 'es', {
            sensitivity: 'base',
        })
    })
})

const filteredProducts = computed(() => {
    const normalizedSearch = normalizeText(searchText.value)

    return products.filter((product) => {
        const searchableContent = normalizeText([
            product.name,
            product.platform,
            product.category,
        ].join(' '))

        const matchesSearch =
            !normalizedSearch
            || searchableContent.includes(normalizedSearch)

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

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase('es')
        .trim()
}

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
    const selectedProduct = products.find((product) => {
        return Number(product.id) === Number(productId)
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
    const selectedProduct = products.find((product) => {
        return Number(product.id) === Number(productId)
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
</script>

<template>
    <main class="product-list-page flex-grow-1 py-4 py-md-5">
        <div class="container-fluid product-list-container">
            <ProductFilter :categories="availableCategories" :platforms="availablePlatforms"
                :result-count="filteredProducts.length" />

            <section class="products-panel bg-secondary-subtle p-3 p-md-4 p-xl-5" aria-labelledby="products-title">
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

                <ProductList :products="filteredProducts" :favorite-product-ids="favoriteProductIds"
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
}

.products-count {
    font-size: 0.75rem;
}

@media (min-width: 1200px) {
    .products-panel {
        padding-inline: 3.5rem !important;
    }
}
</style>