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
    <section class="cart-panel bg-secondary-subtle p-3 p-md-4" aria-labelledby="cart-title">
        <!-- Título y botón de vaciar -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div class="d-flex flex-wrap align-items-baseline gap-2">
                <h1 id="cart-title" class="m-0 fs-2 text-uppercase">
                    Mi carrito
                </h1>

                <span id="cart-count" class="small" aria-live="polite">
                    ({{ productCountLabel }})
                </span>
            </div>

            <button class="clear-cart-button btn btn-link d-inline-flex align-items-center
               gap-2 p-0 border-0 text-danger text-decoration-none small" type="button"
                :disabled="props.items.length === 0" @click="emit('clear-cart')">
                <img :src="removeIcon" alt="" width="22" height="22" aria-hidden="true">

                Vaciar carrito
            </button>
        </div>

        <!-- Carrito vacío -->
        <div v-if="props.items.length === 0" class="cart-empty bg-warning-subtle p-4 text-center" role="status">
            <h2 class="fs-5 mb-3">
                Tu carrito está vacío
            </h2>

            <p class="small mb-0">
                Agrega videojuegos, consolas o accesorios para continuar.
            </p>
        </div>

        <template v-else>
            <!-- Encabezados para tablet y escritorio -->
            <div class="row g-3 align-items-center d-none d-md-flex
               mb-2 px-3 text-uppercase small" aria-hidden="true">
                <span class="col-md-6">
                    Producto
                </span>

                <span class="col-md-3 text-center">
                    Cantidad
                </span>

                <span class="col-md-2 text-end">
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
    color: #151515;
}

.clear-cart-button {
    font-family: inherit;
}

.clear-cart-button:hover:not(:disabled),
.clear-cart-button:focus-visible:not(:disabled) {
    color: #dc3545;
    background-color: transparent;
    outline: 3px solid #111;
    outline-offset: 3px;
}

.clear-cart-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.cart-empty {
    border: 3px solid #111;
}
</style>