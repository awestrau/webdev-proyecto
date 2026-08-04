<script setup>
import { computed } from 'vue'

import CartItem from './CartItem.vue'
import removeIcon from '../../assets/icons/remove.svg'

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
})

const emit = defineEmits([
    'increase-quantity',
    'decrease-quantity',
    'remove-product',
    'clear-cart',
    'view-details',
])

const productCountLabel = computed(() => {
    const productCount = props.items.length
    const word = productCount === 1 ? 'producto' : 'productos'

    return `${productCount} ${word}`
})

function increaseQuantity(productId) {
    emit('increase-quantity', productId)
}

function decreaseQuantity(productId) {
    emit('decrease-quantity', productId)
}

function removeProduct(productId) {
    emit('remove-product', productId)
}

function viewProductDetails(productId) {
    emit('view-details', productId)
}
</script>

<template>
    <section class="cart-panel nes-container is-rounded" aria-labelledby="cart-title">
        <!-- Título y botón de vaciar -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div class="d-flex flex-wrap align-items-baseline gap-2">
                <h1 id="cart-title" class="cart-title m-0">
                    Mi carrito
                </h1>

                <span id="cart-count" class="cart-count" aria-live="polite">
                    ({{ productCountLabel }})
                </span>
            </div>

            <button class="clear-cart-button d-inline-flex align-items-center
               gap-2" type="button" :disabled="props.items.length === 0" @click="emit('clear-cart')">
                <img :src="removeIcon" alt="" width="22" height="22" aria-hidden="true">

                Vaciar carrito
            </button>
        </div>

        <!-- Carrito vacío -->
        <div v-if="props.items.length === 0" class="cart-empty nes-container text-center" role="status">
            <h2 class="cart-empty__title mb-3">
                Tu carrito está vacío
            </h2>

            <p class="cart-empty__text mb-0">
                Agrega videojuegos, consolas o accesorios para continuar.
            </p>
        </div>

        <template v-else>
            <!-- Encabezados para tablet y escritorio -->
            <div class="row g-3 align-items-center d-none d-md-flex
               mb-2 px-3 text-uppercase" aria-hidden="true">
                <span class="cart-column-header col-md-6">
                    Producto
                </span>

                <span class="cart-column-header col-md-3 text-center">
                    Cantidad
                </span>

                <span class="cart-column-header col-md-2 text-end">
                    Precio
                </span>

                <span class="col-md-1"></span>
            </div>

            <!-- Productos dinámicos -->
            <ul id="cart-items" class="cart-item-list d-flex flex-column gap-3 p-0 m-0 list-unstyled">
                <CartItem v-for="product in props.items" :key="product.id" :product="product"
                    @increase="increaseQuantity" @decrease="decreaseQuantity" @remove="removeProduct"
                    @view-details="viewProductDetails" />
            </ul>
        </template>
    </section>
</template>

<style scoped>
.cart-panel {
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.cart-title {
    font-family: 'Press Start 2P', cursive;
    font-size: 1rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.cart-count {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
    color: #1a1f1f;
}

.cart-column-header {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    color: #1a1f1f;
}

.clear-cart-button {
    margin: 0;
    padding: 0.6rem 0.9rem;
    border: 3px solid #111;
    background-color: #fff;
    color: #111;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    line-height: 1.6;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 3px 3px 0 #111;
}

.clear-cart-button:hover:not(:disabled),
.clear-cart-button:focus-visible:not(:disabled) {
    background-color: #e45b61;
    color: #fff;
    outline: 3px solid #111;
    outline-offset: 3px;
}

.clear-cart-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.cart-empty {
    max-width: 620px;
    margin-inline: auto;
    border: 3px solid #111;
    box-shadow: 4px 4px 0 #111;
    background-color: #fff1d7;
    color: #151515;
}

.cart-empty__title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
    line-height: 1.8;
    text-transform: uppercase;
}

.cart-empty__text {
    font-size: 0.8rem;
    line-height: 1.6;
}
</style>
