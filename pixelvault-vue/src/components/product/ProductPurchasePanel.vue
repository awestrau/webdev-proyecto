<script setup>
import { formatCurrency } from '../../utils/formatCurrency'

defineProps({
    product: {
        type: Object,
        required: true,
    },

    favorite: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'add-to-cart',
    'toggle-favorite',
])
</script>

<template>
    <aside class="product-purchase-panel nes-container is-rounded d-flex flex-column"
        aria-labelledby="product-name">
        <p class="product-platform mb-4">
            {{ product.platform }}
        </p>

        <h1 id="product-name" class="product-name mb-4">
            {{ product.name }}
        </h1>

        <p class="product-price mb-5">
            {{ formatCurrency(product.price) }}
        </p>

        <div class="d-flex flex-column align-items-center gap-3 mt-auto">
            <button class="add-cart-button nes-btn is-primary w-100" type="button" @click="emit('add-to-cart')">
                Agregar al carrito
            </button>

            <button class="favorite-button nes-btn py-3 px-4" :class="favorite ? 'is-error' : 'is-warning'"
                type="button" :aria-pressed="favorite" @click="emit('toggle-favorite')">
                {{ favorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
            </button>
        </div>
    </aside>
</template>

<style scoped>
.product-purchase-panel {
    min-height: 420px;
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.product-platform {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.8;
    color: #1a1f1f;
    text-transform: uppercase;
}

.product-name {
    font-family: 'Press Start 2P', cursive;
    font-size: clamp(0.85rem, 4vw, 1.25rem);
    line-height: 1.8;
    color: #1a1f1f;
    text-transform: uppercase;
    overflow-wrap: anywhere;
}

.product-price {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.85rem;
    line-height: 1.8;
    color: #1a1f1f;
}

.add-cart-button,
.favorite-button {
    margin: 0;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.6;
    text-transform: uppercase;
}

.add-cart-button {
    max-width: 340px;
    padding: 0.9rem 1rem;
}

.favorite-button {
    padding: 0.9rem 1.5rem;
}

/* Paleta del proyecto sobre los botones nes.css */
.product-purchase-panel .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.product-purchase-panel .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.product-purchase-panel .nes-btn.is-primary:hover,
.product-purchase-panel .nes-btn.is-primary:focus-visible {
    background-color: #feb914;
    color: #111;
}

.product-purchase-panel .nes-btn.is-primary:hover::after,
.product-purchase-panel .nes-btn.is-primary:focus-visible::after {
    box-shadow: inset -6px -6px #e5a800;
}

.product-purchase-panel .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.product-purchase-panel .nes-btn.is-warning {
    background-color: #feb914;
    color: #111;
}

.product-purchase-panel .nes-btn.is-warning::after {
    box-shadow: inset -4px -4px #e5a800;
}

.product-purchase-panel .nes-btn.is-warning:hover,
.product-purchase-panel .nes-btn.is-warning:focus-visible {
    background-color: #54b3ea;
    color: #111;
}

.product-purchase-panel .nes-btn.is-warning:hover::after,
.product-purchase-panel .nes-btn.is-warning:focus-visible::after {
    box-shadow: inset -6px -6px #3a8ec7;
}

.product-purchase-panel .nes-btn.is-warning:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #e5a800;
}

.product-purchase-panel .nes-btn.is-error {
    background-color: #e45b61;
    color: #fff;
}

.product-purchase-panel .nes-btn.is-error::after {
    box-shadow: inset -4px -4px #8c2022;
}

.product-purchase-panel .nes-btn.is-error:hover,
.product-purchase-panel .nes-btn.is-error:focus-visible {
    background-color: #ce372b;
    color: #fff;
}

.product-purchase-panel .nes-btn.is-error:hover::after,
.product-purchase-panel .nes-btn.is-error:focus-visible::after {
    box-shadow: inset -6px -6px #8c2022;
}

.product-purchase-panel .nes-btn.is-error:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #8c2022;
}

.add-cart-button:focus-visible,
.favorite-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>
