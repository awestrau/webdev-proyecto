<script setup>
import {
    computed,
    onBeforeUnmount,
    ref,
} from 'vue'

import FavoriteProductCard from '../components/favorites/FavoriteProductCard.vue'
import FavoriteProductModal from '../components/favorites/FavoriteProductModal.vue'

import { useCart } from '../composables/useCart'
import { useFavorites } from '../composables/useFavorites'

import products from '../data/products.json'

const selectedProduct = ref(null)
const feedbackMessage = ref('')
const feedbackType = ref('success')

let feedbackTimer = null

const {
    addToCart,
} = useCart(products)

const {
    favoriteProductIds,
    removeFavorite,
} = useFavorites()

const favoriteProducts = computed(() => {
    return favoriteProductIds.value
        .map((productId) => {
            return products.find((product) => {
                return Number(product.id) === Number(productId)
            })
        })
        .filter(Boolean)
})

const favoriteCountLabel = computed(() => {
    const count = favoriteProducts.value.length
    const word = count === 1
        ? 'producto guardado'
        : 'productos guardados'

    return `${count} ${word}`
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

function openProductDetails(product) {
    selectedProduct.value = product
}

function addProductToCart(productId) {
    const product = products.find((item) => {
        return Number(item.id) === Number(productId)
    })

    if (!product) {
        showFeedback(
            'No fue posible encontrar el producto.',
            'danger',
        )
        return
    }

    const added = addToCart(product.id)

    if (added) {
        showFeedback(
            `${product.name} se agregó al carrito.`,
        )
    }
}

function removeProductFromFavorites(productId) {
    const product = products.find((item) => {
        return Number(item.id) === Number(productId)
    })

    removeFavorite(productId)

    showFeedback(
        product
            ? `${product.name} se eliminó de favoritos.`
            : 'El producto se eliminó de favoritos.',
    )
}

onBeforeUnmount(() => {
    if (feedbackTimer) {
        window.clearTimeout(feedbackTimer)
    }
})
</script>

<template>
    <main class="favorites-page flex-grow-1 py-4 py-md-5">
        <div class="container-fluid favorites-container">
            <section class="favorites-panel bg-secondary-subtle p-3 p-md-4 p-xl-5" aria-labelledby="favorites-title">
                <!-- Encabezado -->
                <div class="d-flex flex-wrap align-items-baseline gap-3 mb-4 mb-md-5">
                    <h1 id="favorites-title" class="m-0 fs-2">
                        Mis productos guardados
                    </h1>

                    <span class="favorites-count" aria-live="polite">
                        {{ favoriteCountLabel }}
                    </span>
                </div>

                <!-- Mensajes de acciones -->
                <div v-if="feedbackMessage" class="alert mb-4" :class="`alert-${feedbackType}`" role="status"
                    aria-live="polite">
                    {{ feedbackMessage }}
                </div>

                <!-- No hay favoritos -->
                <div v-if="favoriteProducts.length === 0"
                    class="favorites-empty bg-warning-subtle p-4 p-md-5 text-center" role="status">
                    <h2 class="fs-4 mb-3">
                        No tienes productos guardados
                    </h2>

                    <p class="small mb-4">
                        Agrega productos a favoritos desde la vista de detalle.
                    </p>

                    <RouterLink :to="{ name: 'home' }" class="empty-action-button btn">
                        Explorar producto
                    </RouterLink>
                </div>

                <!-- Productos guardados -->
                <div v-else class="row g-4 g-xl-5">
                    <div v-for="product in favoriteProducts" :key="product.id" class="col-12 col-md-6 col-xl-4">
                        <FavoriteProductCard :product="product" @add-to-cart="addProductToCart"
                            @remove-favorite="removeProductFromFavorites" @open-details="openProductDetails" />
                    </div>
                </div>
            </section>
        </div>

        <FavoriteProductModal :product="selectedProduct" />
    </main>
</template>

<style scoped>
.favorites-page {
    background-color: #fff;
    color: #151515;
}

.favorites-container {
    max-width: 1500px;
}

.favorites-panel {
    min-height: 650px;
}

.favorites-count {
    font-size: 0.75rem;
}

.favorites-empty {
    max-width: 700px;
    margin-inline: auto;
    border: 3px solid #111;
    box-shadow: 4px 4px 0 #111;
}

.empty-action-button {
    border: 3px solid #111;
    background-color: #54b3ea;
    box-shadow: 3px 3px 0 #111;
    color: #111;
    font-family: inherit;
    text-transform: uppercase;
}

.empty-action-button:hover,
.empty-action-button:focus-visible {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 3px;
}

@media (min-width: 1200px) {
    .favorites-panel {
        padding-inline: 3.5rem !important;
    }
}
</style>