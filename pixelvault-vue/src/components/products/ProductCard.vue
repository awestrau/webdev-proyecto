<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

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

const mainImage = computed(() => {
    return props.product.images?.[0] ?? ''
})

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value)
}
</script>

<template>
    <article class="product-card d-flex flex-column h-100
           p-3 bg-warning-subtle">
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
                <img v-if="mainImage" :src="mainImage" :alt="product.name">

                <span v-else class="small text-center p-3">
                    Imagen no disponible
                </span>
            </span>
        </RouterLink>

        <p class="product-card__price text-center mb-3">
            {{ formatCurrency(product.price) }}
        </p>

        <div class="d-flex flex-column flex-sm-row gap-3 mt-auto">
            <button class="product-action-button btn flex-fill" type="button" @click="emit('add-to-cart', product.id)">
                Agregar al carrito
            </button>

            <button class="product-action-button btn flex-fill" type="button" :aria-pressed="favorite"
                @click="emit('toggle-favorite', product.id)">
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
    border-radius: 1.5rem;
    color: #151515;
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
    font-size: 0.8rem;
    line-height: 1.6;
    overflow-wrap: anywhere;
}

.product-card__platform,
.product-card__category {
    font-size: 0.62rem;
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
    border-radius: 1.5rem;
    background-color: #6c3d0c;
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
    font-size: 0.75rem;
}

.product-action-button {
    min-height: 62px;
    border: 3px solid #111;
    border-radius: 1.4rem;
    background-color: #54b3ea;
    color: #111;
    font-family: inherit;
    font-size: 0.58rem;
    line-height: 1.6;
    text-transform: uppercase;
}

.product-action-button:hover,
.product-action-button:focus-visible {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>