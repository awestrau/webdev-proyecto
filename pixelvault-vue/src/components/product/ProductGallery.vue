<script setup>
const props = defineProps({
    images: {
        type: Array,
        default: () => [],
    },

    modelValue: {
        type: String,
        default: '',
    },

    productName: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

function selectImage(image) {
    emit('update:modelValue', image)
}
</script>

<template>
    <section class="product-gallery" aria-label="Galería de imágenes del producto">
        <div class="d-flex flex-column flex-sm-row gap-3">
            <!-- Miniaturas -->
            <div class="product-thumbnails d-flex flex-row flex-sm-column gap-3" aria-label="Imágenes disponibles">
                <button v-for="(image, index) in images" :key="image"
                    class="product-thumbnail btn p-2 bg-warning-subtle" :class="{
                        'product-thumbnail--selected': modelValue === image,
                    }" type="button" :aria-label="`Mostrar imagen ${index + 1} de ${productName}`"
                    :aria-pressed="modelValue === image" @mouseenter="selectImage(image)" @focus="selectImage(image)"
                    @click="selectImage(image)">
                    <img :src="image" :alt="`${productName}, miniatura ${index + 1}`">
                </button>
            </div>

            <!-- Imagen principal -->
            <div class="product-main-image flex-grow-1 d-flex align-items-center
               justify-content-center p-3 p-md-4 bg-warning-subtle">
                <img v-if="modelValue" :src="modelValue" :alt="productName">

                <p v-else class="small text-center mb-0">
                    Este producto no tiene imágenes disponibles.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.product-thumbnails {
    overflow-x: auto;
    padding: 0.2rem;
}

.product-thumbnail {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    overflow: hidden;
    border: 4px solid transparent;
    border-radius: 1.25rem;
}

.product-thumbnail:hover,
.product-thumbnail:focus-visible,
.product-thumbnail--selected {
    border-color: #54b3ea;
    outline: none;
}

.product-thumbnail--selected {
    box-shadow: 3px 3px 0 #111;
}

.product-thumbnail img,
.product-main-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.product-main-image {
    min-height: 320px;
    border-radius: 1.5rem;
}

@media (min-width: 768px) {
    .product-main-image {
        min-height: 520px;
    }
}
</style>