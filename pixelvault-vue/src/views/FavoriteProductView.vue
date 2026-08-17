<script setup>
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
} from 'vue'

import FavoriteProductCard from '../components/favorites/FavoriteProductCard.vue'
import FavoriteProductModal from '../components/favorites/FavoriteProductModal.vue'

import { useCart } from '../composables/useCart'
import { useFavorites } from '../composables/useFavorites'
import { useProducts } from '../composables/useProducts'

const selectedProduct = ref(null)
const feedbackMessage = ref('')
const feedbackType = ref('success')

let feedbackTimer = null

const {
    products,
    loadingProducts,
    productsError,
    loadProducts,
} = useProducts()

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
            return products.value.find((product) => {
                return String(product.id) === String(productId)
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
    const product = products.value.find((item) => {
        return String(item.id) === String(productId)
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
    const product = products.value.find((item) => {
        return String(item.id) === String(productId)
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

onMounted(() => {
    loadProducts().catch(() => {})
})

function retryProducts() {
    loadProducts({ force: true }).catch(() => {})
}
</script>

<template>
    <main class="favorites-page flex-grow-1 py-4 py-md-5">
        <div class="container-fluid favorites-container">
            <section class="favorites-panel nes-container is-rounded" aria-labelledby="favorites-title">
                <!-- Encabezado -->
                <div class="d-flex flex-wrap align-items-baseline gap-3 mb-4 mb-md-5">
                    <h1 id="favorites-title" class="favorites-title m-0">
                        Mis productos guardados
                    </h1>

                    <span class="favorites-count" aria-live="polite">
                        {{ favoriteCountLabel }}
                    </span>
                </div>

                <!-- Mensajes de acciones -->
                <div v-if="feedbackMessage" class="feedback-box mb-4" :class="`feedback-box--${feedbackType}`"
                    role="status" aria-live="polite">
                    {{ feedbackMessage }}
                </div>

                <div v-if="loadingProducts" class="favorites-empty nes-container text-center" role="status">
                    Cargando productos guardados...
                </div>

                <div v-else-if="productsError" class="favorites-empty nes-container text-center" role="alert">
                    <h2 class="favorites-empty__title mb-3">API no disponible</h2>
                    <p class="favorites-empty__text mb-4">{{ productsError }}</p>
                    <button class="empty-action-button nes-btn is-primary" type="button" @click="retryProducts">
                        Reintentar
                    </button>
                </div>

                <!-- No hay favoritos -->
                <div v-else-if="favoriteProducts.length === 0"
                    class="favorites-empty nes-container text-center" role="status">
                    <h2 class="favorites-empty__title mb-3">
                        No tienes productos guardados
                    </h2>

                    <p class="favorites-empty__text mb-4">
                        Agrega productos a favoritos desde la vista de detalle.
                    </p>

                    <RouterLink :to="{ name: 'home' }" class="empty-action-button nes-btn is-primary">
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
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.favorites-title {
    font-family: 'Press Start 2P', cursive;
    font-size: 1rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.favorites-count {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    color: #1a1f1f;
    background-color: #feb914;
    border: 3px solid #111;
    box-shadow: 3px 3px 0 #111;
    padding: 0.45rem 0.65rem;
}

.feedback-box {
    padding: 0.85rem 1rem;
    border: 3px solid #111;
    font-size: 0.8rem;
    line-height: 1.6;
}

.feedback-box--success {
    background-color: #fff1d7;
    color: #151515;
}

.feedback-box--danger {
    background-color: #fdecea;
    color: #8c2022;
}

.favorites-empty {
    max-width: 700px;
    margin-inline: auto;
    border: 3px solid #111;
    box-shadow: 4px 4px 0 #111;
    background-color: #fff;
    color: #151515;
}

.favorites-empty__title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    line-height: 1.8;
    text-transform: uppercase;
}

.favorites-empty__text {
    font-size: 0.85rem;
    line-height: 1.6;
}

.empty-action-button {
    margin: 0;
    padding: 0.85rem 1.25rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.6;
    text-transform: uppercase;
}

/* Paleta del proyecto sobre el botón nes.css */
.favorites-empty .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.favorites-empty .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.favorites-empty .nes-btn.is-primary:hover,
.favorites-empty .nes-btn.is-primary:focus-visible {
    background-color: #feb914;
    color: #111;
}

.favorites-empty .nes-btn.is-primary:hover::after,
.favorites-empty .nes-btn.is-primary:focus-visible::after {
    box-shadow: inset -6px -6px #e5a800;
}

.favorites-empty .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.empty-action-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}

@media (min-width: 1200px) {
    .favorites-panel {
        padding-inline: 2.5rem;
    }
}
</style>
