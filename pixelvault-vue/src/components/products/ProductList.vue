<script setup>
import ProductCard from './ProductCard.vue'

const props = defineProps({
    products: {
        type: Array,
        default: () => [],
    },

    favoriteProductIds: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'add-to-cart',
    'toggle-favorite',
])

function isFavorite(productId) {
    return props.favoriteProductIds.some((favoriteId) => {
        return Number(favoriteId) === Number(productId)
    })
}
</script>

<template>
    <div v-if="products.length === 0" class="products-empty nes-container text-center" role="status">
        <h2 class="fs-4 mb-3">
            No se encontraron productos
        </h2>

        <p class="small mb-0">
            Intenta utilizar otro nombre, categoría o plataforma.
        </p>
    </div>

    <div v-else class="row g-4 g-xl-5">
        <div v-for="product in products" :key="product.id" class="col-12 col-md-6 col-xl-4">
            <ProductCard :product="product" :favorite="isFavorite(product.id)"
                @add-to-cart="emit('add-to-cart', $event)" @toggle-favorite="emit('toggle-favorite', $event)" />
        </div>
    </div>
</template>

<style scoped>
.products-empty {
    max-width: 720px;
    margin-inline: auto;
    border: 3px solid #111;
    box-shadow: 4px 4px 0 #111;
    background-color: #fff;
    color: #151515;
}

.products-empty h2 {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    line-height: 1.8;
    text-transform: uppercase;
}

.products-empty p {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.8;
}
</style>