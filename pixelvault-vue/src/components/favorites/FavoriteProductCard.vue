<script setup>
import {
    computed,
    ref,
    watch,
} from 'vue'

import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits([
    'add-to-cart',
    'remove-favorite',
    'open-details',
])

const imageFailed = ref(false)

const mainImage = computed(() => {
    return props.product.images?.[0] ?? ''
})

watch(
    () => props.product.images,
    () => {
        imageFailed.value = false
    },
)

function handleImageError() {
    imageFailed.value = true
}
</script>

<template>
    <article class="favorite-product-card nes-container is-rounded d-flex flex-column h-100">
        <!-- Información principal -->
        <header class="text-center mb-3">
            <h2 class="favorite-product-name mb-2">
                {{ product.name }}
            </h2>

            <p class="favorite-product-platform mb-0">
                {{ product.platform }}
            </p>
        </header>

        <!-- Imagen clickeable -->
        <button class="favorite-product-image-button p-0 mb-3" type="button" data-bs-toggle="modal"
            data-bs-target="#favorite-product-modal" :aria-label="`Ver información de ${product.name}`"
            @click="emit('open-details', product)">
            <span class="favorite-product-image d-flex align-items-center
               justify-content-center">
                <img v-if="mainImage && !imageFailed" :src="mainImage" :alt="product.name"
                    @error="handleImageError">

                <span v-else class="small text-center p-3" aria-hidden="true">
                    Imagen no disponible
                </span>
            </span>
        </button>

        <!-- Precio -->
        <p class="favorite-product-price text-center mb-3">
            {{ formatCurrency(product.price) }}
        </p>

        <!-- Acciones -->
        <div class="d-flex flex-column flex-sm-row gap-3 mt-auto">
            <button class="favorite-action-button nes-btn is-primary flex-fill" type="button"
                @click="emit('add-to-cart', product.id)">
                Agregar al carrito
            </button>

            <button class="favorite-action-button nes-btn is-error flex-fill" type="button"
                @click="emit('remove-favorite', product.id)">
                Borrar de favoritos
            </button>
        </div>
    </article>
</template>

<style scoped>
.favorite-product-card {
    width: 100%;
    max-width: 390px;
    margin-inline: auto;
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.favorite-product-name {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
    overflow-wrap: anywhere;
}

.favorite-product-platform {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    line-height: 1.6;
    color: #4a4d4f;
}

.favorite-product-image-button {
    width: 100%;
    border: 0;
    background-color: transparent;
    cursor: pointer;
}

.favorite-product-image {
    width: 100%;
    overflow: hidden;
    aspect-ratio: 1;
    border: 3px solid #111;
    background-color: #fff1d7;
    transition:
        border-color 150ms ease,
        transform 150ms ease;
}

.favorite-product-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.favorite-product-image-button:hover .favorite-product-image,
.favorite-product-image-button:focus-visible .favorite-product-image {
    border-color: #54b3ea;
    box-shadow: 4px 4px 0 #111;
    transform: translateY(-2px);
}

.favorite-product-image-button:focus-visible {
    outline: none;
}

.favorite-product-price {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
    line-height: 1.8;
    color: #1a1f1f;
}

.favorite-action-button {
    min-height: 62px;
    margin: 0;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
    line-height: 1.6;
    text-transform: uppercase;
}

/* Paleta del proyecto sobre los botones nes.css */
.favorite-product-card .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.favorite-product-card .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.favorite-product-card .nes-btn.is-primary:hover,
.favorite-product-card .nes-btn.is-primary:focus-visible {
    background-color: #feb914;
    color: #111;
}

.favorite-product-card .nes-btn.is-primary:hover::after,
.favorite-product-card .nes-btn.is-primary:focus-visible::after {
    box-shadow: inset -6px -6px #e5a800;
}

.favorite-product-card .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.favorite-product-card .nes-btn.is-error {
    background-color: #e45b61;
    color: #fff;
}

.favorite-product-card .nes-btn.is-error::after {
    box-shadow: inset -4px -4px #8c2022;
}

.favorite-product-card .nes-btn.is-error:hover,
.favorite-product-card .nes-btn.is-error:focus-visible {
    background-color: #ce372b;
    color: #fff;
}

.favorite-product-card .nes-btn.is-error:hover::after,
.favorite-product-card .nes-btn.is-error:focus-visible::after {
    box-shadow: inset -6px -6px #8c2022;
}

.favorite-product-card .nes-btn.is-error:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #8c2022;
}

.favorite-action-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>
