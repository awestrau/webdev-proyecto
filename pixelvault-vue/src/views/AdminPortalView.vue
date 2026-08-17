<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import AdminProductMetrics from '../components/admin/AdminProductMetrics.vue'
import AdminProductSection from '../components/admin/AdminProductSection.vue'
import AdminSidebar from '../components/admin/AdminSidebar.vue'

import { useProducts } from '../composables/useProducts'

const {
  allProducts,
  allCategories,
  allPlatforms,
  loadingProducts,
  productsError,
  loadProducts,
  addProduct,
  updateProduct,
  setProductStatus,
  clearProductsError,
} = useProducts()

const feedbackMessage = ref('')
const feedbackType = ref('success')

let feedbackTimer = null

function showFeedback(message, type = 'success') {
  feedbackMessage.value = message
  feedbackType.value = type

  if (feedbackTimer) {
    window.clearTimeout(feedbackTimer)
  }

  feedbackTimer = window.setTimeout(() => {
    feedbackMessage.value = ''
  }, 3500)
}

async function handleAddProduct(productData) {
  try {
    const newProduct = await addProduct(productData)

    showFeedback(
      newProduct.name + ' se registró correctamente.',
    )
  } catch (error) {
    showFeedback(error.message, 'danger')
    clearProductsError()
  }
}

async function handleUpdateProduct(productData) {
  try {
    const updatedProduct = await updateProduct(productData)

    showFeedback(
      updatedProduct.name + ' se actualizó correctamente.',
    )
  } catch (error) {
    showFeedback(error.message, 'danger')
    clearProductsError()
  }
}

async function handleToggleProductStatus(product) {
  try {
    const updatedProduct = await setProductStatus(
      product.id,
      product.status === false,
    )

    showFeedback(
      updatedProduct.status
        ? `${updatedProduct.name} se activó correctamente.`
        : `${updatedProduct.name} se desactivó correctamente.`,
    )
  } catch (error) {
    showFeedback(error.message, 'danger')
    clearProductsError()
  }
}

function retryProducts() {
  loadProducts({ force: true }).catch(() => {})
}

onBeforeUnmount(() => {
  if (feedbackTimer) {
    window.clearTimeout(feedbackTimer)
  }
})

onMounted(() => {
  loadProducts().catch(() => {})
})
</script>

<template>
  <main
    class="admin-portal flex-grow-1
           bg-white px-2 py-4 px-lg-4 py-lg-5 text-dark"
  >
    <div class="container-xxl">
      <h1 class="mb-4 text-center fs-4">
        Portal de Administrador
      </h1>

      <div class="row g-3 align-items-stretch">
        <AdminSidebar />

        <section
          class="col-12 col-lg"
          aria-label="Contenido administrativo"
        >
          <AdminProductMetrics
            :product-count="allProducts.length"
            :category-count="allCategories.length"
            :platform-count="allPlatforms.length"
          />

          <div
            v-if="feedbackMessage"
            class="alert"
            :class="'alert-' + feedbackType"
            role="status"
            aria-live="polite"
          >
            {{ feedbackMessage }}
          </div>

          <div v-if="loadingProducts" class="admin-api-state p-5 text-center" role="status">
            Cargando inventario desde MongoDB...
          </div>

          <div v-else-if="productsError" class="alert alert-danger" role="alert">
            <p class="mb-3">{{ productsError }}</p>
            <button class="nes-btn is-primary" type="button" @click="retryProducts">
              Reintentar conexión
            </button>
          </div>

          <AdminProductSection
            v-else
            :products="allProducts"
            :categories="allCategories"
            :platforms="allPlatforms"
            @add-product="handleAddProduct"
            @update-product="handleUpdateProduct"
            @toggle-product-status="handleToggleProductStatus"
          />
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.admin-portal {
  color: #151515;
}

.admin-portal :deep(.alert) {
  border: 3px solid #111;
  border-radius: 0;
  box-shadow: 3px 3px 0 #111;
  font-size: 0.68rem;
}

.admin-api-state {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  background-color: #fff1d7;
  font-size: 0.68rem;
  line-height: 1.8;
}
</style>
