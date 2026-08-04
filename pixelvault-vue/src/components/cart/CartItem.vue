<script setup>
import { computed } from 'vue'

import removeIcon from '../../assets/icons/remove.svg'
import minusIcon from '../../assets/icons/minus.svg'
import plusIcon from '../../assets/icons/plus.svg'
import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
    product: {
        type: Object,
        required: true,
        validator: (product) => {
            return (
                typeof product.id === 'number'
                && typeof product.name === 'string'
                && typeof product.price === 'number'
                && typeof product.quantity === 'number'
            )
        },
    },
})

const emit = defineEmits([
    'increase',
    'decrease',
    'remove',
    'view-details',
])

const itemTotal = computed(() => {
    return props.product.price * props.product.quantity
})

const formattedUnitPrice = computed(() => {
    return formatCurrency(props.product.price)
})

const formattedItemTotal = computed(() => {
    return formatCurrency(itemTotal.value)
})
</script>

<template>
    <li class="cart-item nes-container">
        <div class="row g-3 align-items-center">
            <!-- Imagen -->
            <div class="col-4 col-sm-3 col-md-2 order-md-1">
                <div class="cart-item__image ratio ratio-1x1" :aria-label="`Imagen de ${product.name}`"
                    role="img">
                    <img v-if="product.image" :src="product.image" :alt="product.name" class="cart-product-image">

                    <span v-else class="cart-image-placeholder d-flex align-items-center
                   justify-content-center text-center p-1" aria-hidden="true">
                        {{ product.category }}
                    </span>
                </div>
            </div>

            <!-- Nombre y metadatos -->
            <div class="cart-item__details col-6 col-sm-7 col-md-4 order-md-2">
                <h2 class="cart-item__name mb-2 text-break">
                    <button class="cart-link-button product-detail-button" type="button"
                        @click="emit('view-details', product.id)">
                        {{ product.name }}
                    </button>
                </h2>

                <p class="cart-item__meta mb-1 text-break">
                    {{ product.platform }}
                </p>

                <p class="cart-item__meta mb-0 text-break">
                    {{ product.category }}
                </p>

                <button class="cart-link-button view-details-button mt-2" type="button"
                    @click="emit('view-details', product.id)">
                    Ver detalles
                </button>
            </div>

            <!-- Botón eliminar -->
            <div class="col-2 col-md-1 order-md-5 text-end">
                <button class="cart-action-button d-inline-flex align-items-center
                 justify-content-center" type="button"
                    :aria-label="`Eliminar ${product.name} del carrito`" @click="emit('remove', product.id)">
                    <img :src="removeIcon" alt="" width="28" height="28" aria-hidden="true">
                </button>
            </div>

            <!-- Controles de cantidad -->
            <div class="cart-item__quantity col-8 offset-4 col-sm-5 offset-sm-3
               col-md-3 offset-md-0 order-md-3 d-flex align-items-center
               justify-content-start justify-content-sm-center gap-2" role="group"
                :aria-label="`Control de cantidad de ${product.name}`">
                <button class="cart-action-button d-inline-flex align-items-center
                 justify-content-center" type="button" :disabled="product.quantity <= 1"
                    :aria-label="`Disminuir cantidad de ${product.name}`" @click="emit('decrease', product.id)">
                    <img :src="minusIcon" alt="" width="28" height="28" aria-hidden="true">
                </button>

                <span class="cart-item__quantity-value d-inline-block px-1 text-center" aria-live="polite">
                    {{ product.quantity }}
                </span>

                <button class="cart-action-button d-inline-flex align-items-center
                 justify-content-center" type="button"
                    :aria-label="`Aumentar cantidad de ${product.name}`" @click="emit('increase', product.id)">
                    <img :src="plusIcon" alt="" width="28" height="28" aria-hidden="true">
                </button>
            </div>

            <!-- Precio total del producto -->
            <div class="cart-item__price col-8 offset-4 col-sm-4 offset-sm-0
               col-md-2 order-md-4 text-start text-sm-end">
                <p class="cart-item__total m-0 text-nowrap">
                    <span class="visually-hidden">
                        Precio total:
                    </span>

                    {{ formattedItemTotal }}
                </p>

                <small class="cart-unit-price d-block mt-1">
                    {{ formattedUnitPrice }} c/u
                </small>
            </div>
        </div>
    </li>
</template>

<style scoped>
.cart-item {
    padding: 1rem 1.25rem;
    border: 3px solid #111;
    background-color: #fff;
    color: #151515;
}

.cart-item__image {
    overflow: hidden;
    border: 3px solid #111;
    background-color: #fff1d7;
}

.cart-product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
}

.cart-image-placeholder {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.4rem;
    line-height: 1.5;
    color: #151515;
    text-transform: uppercase;
}

.cart-item__name {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    line-height: 1.8;
}

.cart-item__meta {
    font-size: 0.75rem;
    line-height: 1.5;
    color: #4a4d4f;
}

.cart-link-button {
    padding: 0;
    border: 0;
    background-color: transparent;
    font-family: 'Press Start 2P', cursive;
    color: #151515;
    text-align: left;
    text-decoration: underline dotted 2px #111;
    text-underline-offset: 3px;
    cursor: pointer;
}

.cart-link-button:hover,
.cart-link-button:focus-visible {
    color: #111;
    background-color: #feb914;
    text-decoration: none;
    outline: 2px solid #111;
    outline-offset: 2px;
}

.product-detail-button {
    font-size: 0.5rem;
    line-height: 1.8;
}

.view-details-button {
    font-size: 0.45rem;
}

.cart-action-button {
    width: 42px;
    height: 42px;
    padding: 0;
    border: 3px solid #111;
    background-color: #fff;
    cursor: pointer;
    transition:
        background-color 150ms ease,
        transform 150ms ease;
}

.cart-action-button img {
    image-rendering: pixelated;
}

.cart-action-button:hover:not(:disabled),
.cart-action-button:focus-visible:not(:disabled) {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 2px;
}

.cart-action-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.cart-item__quantity-value {
    min-width: 2rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
}

.cart-item__total {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
    line-height: 1.8;
    color: #1a1f1f;
}

.cart-unit-price {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.4rem;
    line-height: 1.8;
    color: #4a4d4f;
}
</style>
