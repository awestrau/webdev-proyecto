<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'
import Toast from 'bootstrap/js/dist/toast'

import ProductGallery from '../components/product/ProductGallery.vue'
import ProductPurchasePanel from '../components/product/ProductPurchasePanel.vue'

import { useCart } from '../composables/useCart'
import { useFavorites } from '../composables/useFavorites'

import products from '../data/products.json'

const route = useRoute()

const selectedImage = ref('')
const toastElement = ref(null)
const toastMessage = ref('')

let feedbackToast = null

const productId = computed(() => {
  return Number(route.params.id)
})

const product = computed(() => {
  return products.find((item) => {
    return Number(item.id) === productId.value
  }) ?? null
})

const {
  addToCart,
} = useCart(products)

const {
  isFavorite,
  toggleFavorite,
} = useFavorites()

const productIsFavorite = computed(() => {
  if (!product.value) {
    return false
  }

  return isFavorite(product.value.id)
})

watch(
  product,
  (currentProduct) => {
    selectedImage.value = currentProduct?.images?.[0] ?? ''
  },
  {
    immediate: true,
  },
)

async function showFeedback(message) {
  toastMessage.value = message

  await nextTick()

  feedbackToast = Toast.getOrCreateInstance(
    toastElement.value,
    {
      delay: 3000,
    },
  )

  feedbackToast.show()
}

function handleAddToCart() {
  if (!product.value) {
    return
  }

  const added = addToCart(product.value.id)

  if (added) {
    showFeedback(
      `Gracias. ${product.value.name} se agregó al carrito.`,
    )
  }
}

function handleToggleFavorite() {
  if (!product.value) {
    return
  }

  const wasAdded = toggleFavorite(product.value.id)

  showFeedback(
    wasAdded
      ? `${product.value.name} se agregó a favoritos.`
      : `${product.value.name} se eliminó de favoritos.`,
  )
}

onBeforeUnmount(() => {
  feedbackToast?.dispose()
})
</script>

<template>
  <main class="product-detail-page flex-grow-1 py-4 py-md-5">
    <div class="container-fluid product-detail-container">
      <!-- Producto encontrado -->
      <template v-if="product">
        <p class="product-breadcrumb mb-3">
          {{ product.category }} / {{ product.platform }}
        </p>

        <div class="row g-4 align-items-start">
          <!-- Galería y descripción -->
          <div class="col-12 col-lg-8">
            <section class="product-media-panel nes-container is-rounded">
              <ProductGallery
                v-model="selectedImage"
                :images="product.images"
                :product-name="product.name"
              />

              <section
                class="product-description nes-container is-rounded mt-3"
                aria-labelledby="product-description-title"
              >
                <h2
                  id="product-description-title"
                  class="mb-3"
                >
                  Descripción del producto
                </h2>

                <p class="mb-0">
                  {{ product.description }}
                </p>
              </section>
            </section>
          </div>

          <!-- Información y acciones -->
          <div class="col-12 col-lg-4">
            <ProductPurchasePanel
              :product="product"
              :favorite="productIsFavorite"
              @add-to-cart="handleAddToCart"
              @toggle-favorite="handleToggleFavorite"
            />
          </div>
        </div>
      </template>

      <!-- Producto inexistente -->
      <section
        v-else
        class="product-not-found nes-container is-rounded text-center"
        role="alert"
      >
        <h1 class="mb-3">
          Producto no encontrado
        </h1>

        <p class="mb-4">
          El producto solicitado no existe en el catálogo.
        </p>

        <RouterLink
          :to="{ name: 'home' }"
          class="nes-btn is-primary"
        >
          Volver al inicio
        </RouterLink>
      </section>
    </div>

    <!-- Notificación de Bootstrap -->
    <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        ref="toastElement"
        class="toast product-feedback-toast"
        role="status"
      >
        <div class="toast-header">
          <strong class="me-auto">
            PixelVault
          </strong>

          <button
            class="btn-close"
            type="button"
            data-bs-dismiss="toast"
            aria-label="Cerrar"
          />
        </div>

        <div class="toast-body">
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.product-detail-page {
  background-color: #fff;
  color: #151515;
}

.product-detail-container {
  max-width: 1500px;
}

.product-breadcrumb {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.6rem;
  line-height: 1.8;
  color: #1a1f1f;
  text-transform: uppercase;
}

.product-media-panel {
  min-height: 650px;
  background-color: #fff;
  color: #151515;
  box-shadow: 4px 4px 0 #111;
}

.product-description {
  min-height: 175px;
  background-color: #fff1d7;
  color: #151515;
  box-shadow: 4px 4px 0 #111;
}

.product-description h2 {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  line-height: 1.8;
  color: #1a1f1f;
  text-transform: uppercase;
}

.product-description p {
  font-size: 0.9rem;
  line-height: 1.7;
}

/* Producto no encontrado */
.product-not-found {
  max-width: 720px;
  margin-inline: auto;
  background-color: #fff;
  color: #151515;
  box-shadow: 4px 4px 0 #111;
}

.product-not-found h1 {
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  line-height: 1.8;
  text-transform: uppercase;
}

.product-not-found p {
  font-size: 0.9rem;
  line-height: 1.7;
}

.product-not-found .nes-btn.is-primary {
  margin: 0;
  padding: 0.85rem 1.25rem;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.65rem;
  line-height: 1.6;
  text-transform: uppercase;
  background-color: #54b3ea;
  color: #111;
}

.product-not-found .nes-btn.is-primary::after {
  box-shadow: inset -4px -4px #3a8ec7;
}

.product-not-found .nes-btn.is-primary:hover,
.product-not-found .nes-btn.is-primary:focus-visible {
  background-color: #feb914;
  color: #111;
}

.product-not-found .nes-btn.is-primary:hover::after,
.product-not-found .nes-btn.is-primary:focus-visible::after {
  box-shadow: inset -6px -6px #e5a800;
}

.product-not-found .nes-btn.is-primary:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #3a8ec7;
}

.product-not-found .nes-btn.is-primary:focus-visible {
  outline: 3px solid #111;
  outline-offset: 3px;
}

/* Toast de feedback con estética pixel */
.product-feedback-toast {
  border: 3px solid #111;
  border-radius: 0;
  box-shadow: 4px 4px 0 #111;
}

.product-feedback-toast .toast-header {
  background-color: #feb914;
  color: #111;
  border-bottom: 3px solid #111;
}

.product-feedback-toast .toast-header strong {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.6rem;
  line-height: 1.6;
  text-transform: uppercase;
}

.product-feedback-toast .toast-body {
  background-color: #fff;
  color: #151515;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
