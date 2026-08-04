<script setup>
import {
    computed,
    ref,
    watch,
} from 'vue'
import { RouterLink } from 'vue-router'

import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
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
    <article class="product-card nes-container is-rounded d-flex flex-column h-100">
        <header class="text-center mb-3">
            <RouterLink :to="{
                name: 'product-detail',
                params: {
                    id: String(product.id),
                },
            }" class="product-name-link">
                <h2 class="product-card__name mb-2">
                    {{ product.name }}
                </h2>
            </RouterLink>

            <p class="product-card__platform mb-1">
                {{ product.platform }}
            </p>

            <p class="product-card__category mb-0">
                {{ product.category }}
            </p>
        </header>

        <!-- Imagen y enlace al detalle -->
        <RouterLink :to="{
            name: 'product-detail',
            params: {
                id: String(product.id),
            },
        }" class="product-image-link d-block mb-3" :aria-label="`Ver detalles de ${product.name}`">
            <span class="product-card__image d-flex
               align-items-center justify-content-center">
                <img v-if="mainImage && !imageFailed" :src="mainImage" :alt="product.name"
                    @error="handleImageError">

                <span v-else class="small text-center p-3">
                    Imagen no disponible
                </span>
            </span>
        </RouterLink>

        <p class="product-card__price text-center mb-3">
            {{ formatCurrency(product.price) }}
        </p>

        <div class="d-flex flex-column flex-sm-row gap-3 mt-auto">
            <button class="product-action-button nes-btn is-primary flex-fill" type="button"
                @click="emit('add-to-cart', product.id)">
                Agregar al carrito
            </button>

            <button class="product-action-button nes-btn flex-fill" :class="favorite ? 'is-error' : 'is-warning'"
                type="button" :aria-pressed="favorite" @click="emit('toggle-favorite', product.id)">
                {{ favorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
            </button>
        </div>
    </article>
</template>

<style scoped>
.product-card {
    width: 100%;
    max-width: 390px;
    margin-inline: auto;
    color: #151515;
    background-color: #fff;
    box-shadow: 4px 4px 0 #111;
}

.product-name-link {
    color: #151515;
    text-decoration: none;
}

.product-name-link:hover,
.product-name-link:focus-visible {
    color: #151515;
    background-color: #feb914;
    outline: 2px solid #111;
    outline-offset: 2px;
}

.product-card__name {
    min-height: 2.6rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.58rem;
    line-height: 1.6;
    overflow-wrap: anywhere;
    text-transform: uppercase;
}

.product-card__platform,
.product-card__category {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    line-height: 1.5;
}

.product-image-link {
    text-decoration: none;
}

.product-card__image {
    width: 100%;
    overflow: hidden;
    aspect-ratio: 1;
    border: 4px solid transparent;
    border-color: gray;
    transition:
        border-color 150ms ease,
        transform 150ms ease;
}

.product-card__image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.product-image-link:hover .product-card__image,
.product-image-link:focus-visible .product-card__image {
    border-color: #54b3ea;
    box-shadow: 4px 4px 0 #111;
    transform: translateY(-2px);
}

.product-image-link:focus-visible {
    outline: none;
}

.product-card__price {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
}

.product-action-button {
    min-height: 62px;
    margin: 0;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.58rem;
    line-height: 1.6;
    text-transform: uppercase;
}

/* Paleta del proyecto sobre los botones nes.css */
.product-card .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.product-card .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.product-card .nes-btn.is-primary:hover,
.product-card .nes-btn.is-primary:focus-visible {
    background-color: #feb914;
    color: #111;
}

.product-card .nes-btn.is-primary:hover::after,
.product-card .nes-btn.is-primary:focus-visible::after {
    box-shadow: inset -6px -6px #e5a800;
}

.product-card .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.product-card .nes-btn.is-warning {
    background-color: #feb914;
    color: #111;
}

.product-card .nes-btn.is-warning::after {
    box-shadow: inset -4px -4px #e5a800;
}

.product-card .nes-btn.is-warning:hover,
.product-card .nes-btn.is-warning:focus-visible {
    background-color: #54b3ea;
    color: #111;
}

.product-card .nes-btn.is-warning:hover::after,
.product-card .nes-btn.is-warning:focus-visible::after {
    box-shadow: inset -6px -6px #3a8ec7;
}

.product-card .nes-btn.is-warning:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #e5a800;
}

.product-card .nes-btn.is-error {
    background-color: #e45b61;
    color: #fff;
}

.product-card .nes-btn.is-error::after {
    box-shadow: inset -4px -4px #8c2022;
}

.product-card .nes-btn.is-error:hover,
.product-card .nes-btn.is-error:focus-visible {
    background-color: #ce372b;
    color: #fff;
}

.product-card .nes-btn.is-error:hover::after,
.product-card .nes-btn.is-error:focus-visible::after {
    box-shadow: inset -6px -6px #8c2022;
}

.product-card .nes-btn.is-error:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #8c2022;
}

.product-action-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>
