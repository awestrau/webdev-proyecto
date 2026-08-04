<script setup>
import {
    computed,
    onBeforeUnmount,
    ref,
    watch,
} from 'vue'
import { useRouter } from 'vue-router'
import Modal from 'bootstrap/js/dist/modal'

import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
    product: {
        type: Object,
        default: null,
    },
})

const router = useRouter()
const modalElement = ref(null)
const imageFailed = ref(false)

const mainImage = computed(() => {
    return props.product?.images?.[0] ?? ''
})

watch(
    () => props.product?.images,
    () => {
        imageFailed.value = false
    },
)

function handleImageError() {
    imageFailed.value = true
}

function goToProductDetails() {
    if (!props.product) {
        return
    }

    const productId = props.product.id
    const modal = Modal.getOrCreateInstance(modalElement.value)

    modalElement.value.addEventListener(
        'hidden.bs.modal',
        () => {
            router.push({
                name: 'product-detail',
                params: {
                    id: String(productId),
                },
            })
        },
        {
            once: true,
        },
    )

    modal.hide()
}

onBeforeUnmount(() => {
    Modal.getInstance(modalElement.value)?.dispose()
})
</script>

<template>
    <div id="favorite-product-modal" ref="modalElement" class="modal fade" tabindex="-1"
        aria-labelledby="favorite-product-modal-title" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content favorite-modal">
                <div class="modal-header">
                    <h2 id="favorite-product-modal-title" class="modal-title fs-5">
                        Información del producto
                    </h2>

                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Cerrar" />
                </div>

                <div v-if="product" class="modal-body p-3 p-md-4">
                    <div class="row g-4 align-items-center">
                        <!-- Imagen -->
                        <div class="col-12 col-md-5">
                            <div class="favorite-modal-image d-flex
                       align-items-center justify-content-center
                       bg-warning-subtle">
                                <img v-if="mainImage && !imageFailed" :src="mainImage" :alt="product.name"
                                    @error="handleImageError">

                                <span v-else class="small text-center">
                                    Imagen no disponible
                                </span>
                            </div>
                        </div>

                        <!-- Información sin descripción -->
                        <div class="col-12 col-md-7">
                            <h3 class="fs-4 mb-4">
                                {{ product.name }}
                            </h3>

                            <dl class="row favorite-modal-details mb-0">
                                <dt class="col-5 mb-3">
                                    ID:
                                </dt>

                                <dd class="col-7 mb-3">
                                    {{ product.id }}
                                </dd>

                                <dt class="col-5 mb-3">
                                    Plataforma:
                                </dt>

                                <dd class="col-7 mb-3">
                                    {{ product.platform }}
                                </dd>

                                <dt class="col-5 mb-3">
                                    Categoría:
                                </dt>

                                <dd class="col-7 mb-3">
                                    {{ product.category }}
                                </dd>

                                <dt class="col-5 mb-0">
                                    Precio:
                                </dt>

                                <dd class="col-7 mb-0">
                                    {{ formatCurrency(product.price) }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">
                        Cerrar
                    </button>

                    <button class="view-product-button btn" type="button" :disabled="!product"
                        @click="goToProductDetails">
                        Ver más detalles
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.favorite-modal {
    border: 4px solid #111;
    border-radius: 0;
    box-shadow: 6px 6px 0 #111;
}

.favorite-modal-image {
    overflow: hidden;
    aspect-ratio: 1;
    border-radius: 1.5rem;
}

.favorite-modal-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.favorite-modal-details {
    font-size: 0.75rem;
    line-height: 1.6;
}

.favorite-modal-details dt,
.favorite-modal-details dd {
    overflow-wrap: anywhere;
}

.view-product-button {
    border: 3px solid #111;
    background-color: #54b3ea;
    box-shadow: 3px 3px 0 #111;
    color: #111;
    font-family: inherit;
}

.view-product-button:hover:not(:disabled),
.view-product-button:focus-visible:not(:disabled) {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 2px;
}
</style>