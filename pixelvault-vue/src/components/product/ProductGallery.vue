<script setup>
import {
    ref,
    watch,
} from 'vue'

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

const failedImages = ref(new Set())

watch(
    () => props.images,
    () => {
        failedImages.value = new Set()
    },
    {
        deep: true,
    },
)

function selectImage(image) {
    emit('update:modelValue', image)
}

function markImageFailed(image) {
    if (!image) {
        return
    }

    failedImages.value = new Set([
        ...failedImages.value,
        image,
    ])
}
</script>

<template>
    <section class="product-gallery" aria-label="Galería de imágenes del producto">
        <div class="d-flex flex-column flex-sm-row gap-3">
            <!-- Miniaturas -->
            <div class="product-thumbnails d-flex flex-row flex-sm-column gap-3" aria-label="Imágenes disponibles">
                <button v-for="(image, index) in images" :key="index"
                    class="product-thumbnail" :class="{
                        'product-thumbnail--selected': modelValue === image,
                    }" type="button" :aria-label="`Mostrar imagen ${index + 1} de ${productName}`"
                    :aria-pressed="modelValue === image" @mouseenter="selectImage(image)" @focus="selectImage(image)"
                    @click="selectImage(image)">
                    <img v-if="!failedImages.has(image)" :src="image"
                        :alt="`${productName}, miniatura ${index + 1}`" @error="markImageFailed(image)">

                    <span v-else class="product-thumbnail-fallback" aria-hidden="true">
                        ×
                    </span>
                </button>
            </div>

            <!-- Imagen principal -->
            <div class="product-main-image flex-grow-1 d-flex align-items-center
               justify-content-center p-3 p-md-4">
                <img v-if="modelValue && !failedImages.has(modelValue)" :src="modelValue" :alt="productName"
                    @error="markImageFailed(modelValue)">

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
    padding: 0;
    overflow: hidden;
    border: 3px solid #111;
    background-color: #fff;
    cursor: pointer;
    transition:
        border-color 150ms ease,
        box-shadow 150ms ease;
}

.product-thumbnail:hover,
.product-thumbnail:focus-visible {
    border-color: #54b3ea;
    outline: 3px solid #111;
    outline-offset: 3px;
}

.product-thumbnail--selected {
    border-color: #111;
    box-shadow: 3px 3px 0 #111;
}

.product-thumbnail img,
.product-main-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.product-thumbnail-fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-family: 'Press Start 2P', cursive;
    font-size: 1.2rem;
    color: #151515;
    background-color: #fff1d7;
}

.product-main-image {
    min-height: 320px;
    border: 3px solid #111;
    background-color: #fff1d7;
    box-shadow: 3px 3px 0 #111;
}

@media (min-width: 768px) {
    .product-main-image {
        min-height: 520px;
    }
}
</style>
