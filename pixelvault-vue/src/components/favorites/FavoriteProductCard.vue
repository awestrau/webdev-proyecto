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
    <article class="favorite-product-card d-flex flex-column h-100
           p-3 bg-warning-subtle">
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
        <button class="favorite-product-image-button btn p-0 mb-3" type="button" data-bs-toggle="modal"
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
            <button class="favorite-action-button btn flex-fill" type="button" @click="emit('add-to-cart', product.id)">
                Agregar al carrito
            </button>

            <button class="favorite-action-button btn flex-fill" type="button"
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
    border-radius: 1.5rem;
    color: #151515;
}

.favorite-product-name {
    font-size: 0.8rem;
    overflow-wrap: anywhere;
}

.favorite-product-platform {
    font-size: 0.65rem;
}

.favorite-product-image-button {
    width: 100%;
    border: 0;
    background-color: transparent;
}

.favorite-product-image {
    width: 100%;
    overflow: hidden;
    aspect-ratio: 1;
    border: 4px solid transparent;
    border-radius: 1.5rem;
    background-color: #6c3d0c;
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
    font-size: 0.75rem;
}

.favorite-action-button {
    min-height: 62px;
    border: 3px solid #111;
    border-radius: 1.4rem;
    background-color: #54b3ea;
    color: #111;
    font-family: inherit;
    font-size: 0.62rem;
    line-height: 1.6;
    text-transform: uppercase;
}

.favorite-action-button:hover,
.favorite-action-button:focus-visible {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>