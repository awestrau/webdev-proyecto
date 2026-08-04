<script setup>
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

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value)
}
</script>

<template>
    <aside class="product-purchase-panel d-flex flex-column p-4 p-md-5 bg-secondary-subtle"
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
            <button class="add-cart-button btn w-100 py-3" type="button" @click="emit('add-to-cart')">
                Agregar al carrito
            </button>

            <button class="favorite-button btn py-3 px-4" type="button" :aria-pressed="favorite"
                @click="emit('toggle-favorite')">
                {{ favorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
            </button>
        </div>
    </aside>
</template>

<style scoped>
.product-purchase-panel {
    min-height: 420px;
    border-radius: 1.5rem;
    color: #151515;
}

.product-platform {
    font-size: 0.8rem;
}

.product-name {
    font-size: clamp(1.7rem, 5vw, 2.7rem);
    overflow-wrap: anywhere;
}

.product-price {
    font-size: 1.15rem;
}

.add-cart-button,
.favorite-button {
    border: 3px solid #111;
    color: #111;
    font-family: inherit;
    text-transform: uppercase;
}

.add-cart-button {
    max-width: 340px;
    background-color: #54b3ea;
    box-shadow: 4px 4px 0 #111;
}

.favorite-button {
    background-color: #fff1d7;
}

.add-cart-button:hover,
.add-cart-button:focus-visible,
.favorite-button:hover,
.favorite-button:focus-visible {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>