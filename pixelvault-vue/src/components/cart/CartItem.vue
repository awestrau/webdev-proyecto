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
    <li class="cart-item bg-warning-subtle p-3">
        <div class="row g-3 align-items-center">
            <!-- Imagen -->
            <div class="col-4 col-sm-3 col-md-2 order-md-1">
                <div class="cart-item__image ratio ratio-1x1 bg-secondary" :aria-label="`Imagen de ${product.name}`"
                    role="img">
                    <img v-if="product.image" :src="product.image" :alt="product.name" class="cart-product-image">

                    <span v-else class="cart-image-placeholder d-flex align-items-center
                   justify-content-center text-center text-white p-1" aria-hidden="true">
                        {{ product.category }}
                    </span>
                </div>
            </div>

            <!-- Nombre y metadatos -->
            <div class="cart-item__details col-6 col-sm-7 col-md-4 order-md-2">
                <h2 class="cart-item__name mb-2 small text-break">
                    <button class="product-detail-button btn btn-link p-0 border-0
                   text-start text-dark text-decoration-none" type="button" @click="emit('view-details', product.id)">
                        {{ product.name }}
                    </button>
                </h2>

                <p class="cart-item__meta mb-1 small text-break">
                    {{ product.platform }}
                </p>

                <p class="cart-item__meta mb-0 small text-break">
                    {{ product.category }}
                </p>

                <button class="view-details-button btn btn-link p-0 mt-2
                 border-0 text-decoration-underline" type="button" @click="emit('view-details', product.id)">
                    Ver detalles
                </button>
            </div>

            <!-- Botón eliminar -->
            <div class="col-2 col-md-1 order-md-5 text-end">
                <button class="cart-action-button btn d-inline-flex align-items-center
                 justify-content-center p-0 border-0 bg-transparent rounded-circle" type="button"
                    :aria-label="`Eliminar ${product.name} del carrito`" @click="emit('remove', product.id)">
                    <img :src="removeIcon" alt="" width="28" height="28" aria-hidden="true">
                </button>
            </div>

            <!-- Controles de cantidad -->
            <div class="cart-item__quantity col-8 offset-4 col-sm-5 offset-sm-3
               col-md-3 offset-md-0 order-md-3 d-flex align-items-center
               justify-content-start justify-content-sm-center gap-2" role="group"
                :aria-label="`Control de cantidad de ${product.name}`">
                <button class="cart-action-button btn d-inline-flex align-items-center
                 justify-content-center p-0 border-0 bg-transparent rounded-circle" type="button"
                    :disabled="product.quantity <= 1" :aria-label="`Disminuir cantidad de ${product.name}`"
                    @click="emit('decrease', product.id)">
                    <img :src="minusIcon" alt="" width="28" height="28" aria-hidden="true">
                </button>

                <span class="cart-item__quantity-value d-inline-block px-1 text-center small" aria-live="polite">
                    {{ product.quantity }}
                </span>

                <button class="cart-action-button btn d-inline-flex align-items-center
                 justify-content-center p-0 border-0 bg-transparent rounded-circle" type="button"
                    :aria-label="`Aumentar cantidad de ${product.name}`" @click="emit('increase', product.id)">
                    <img :src="plusIcon" alt="" width="28" height="28" aria-hidden="true">
                </button>
            </div>

            <!-- Precio total del producto -->
            <div class="cart-item__price col-8 offset-4 col-sm-4 offset-sm-0
               col-md-2 order-md-4 text-start text-sm-end">
                <p class="m-0 small text-nowrap">
                    <span class="visually-hidden">
                        Precio total:
                    </span>

                    {{ formattedItemTotal }}
                </p>

                <small class="cart-unit-price d-block mt-1 text-body-secondary">
                    {{ formattedUnitPrice }} c/u
                </small>
            </div>
        </div>
    </li>
</template>

<style scoped>
.cart-item {
    color: #151515;
}

.cart-item__image {
    overflow: hidden;
}

.cart-product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
}

.cart-image-placeholder {
    font-size: 0.5rem;
    line-height: 1.4;
    text-transform: uppercase;
}

.product-detail-button,
.view-details-button,
.cart-action-button {
    font-family: inherit;
}

.product-detail-button {
    font-size: inherit;
    line-height: 1.5;
}

.product-detail-button:hover,
.product-detail-button:focus-visible,
.view-details-button:hover,
.view-details-button:focus-visible {
    color: #111;
    background-color: #feb914;
    outline: 2px solid #111;
    outline-offset: 2px;
}

.view-details-button {
    color: #151515;
    font-size: 0.55rem;
}

.cart-action-button {
    cursor: pointer;
}

.cart-action-button:hover:not(:disabled),
.cart-action-button:focus-visible:not(:disabled) {
    background-color: #feb914 !important;
    outline: 3px solid #111;
    outline-offset: 2px;
}

.cart-action-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.cart-item__quantity-value {
    min-width: 2rem;
}

.cart-unit-price {
    font-size: 0.5rem;
}
</style>