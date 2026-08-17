<script setup>
import {
  computed,
  nextTick,
  ref,
} from 'vue'

import searchIcon from '../../assets/icons/search.svg'

import ProductFilter from '../products/ProductFilter.vue'
import AdminEditProductModal from './AdminEditProductModal.vue'
import AdminProductCard from './AdminProductCard.vue'
import AdminProductForm from './AdminProductForm.vue'

import {
  productMatchesSearch,
  sanitizeProductSearch,
} from '../../utils/productSearch'

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [],
  },
  platforms: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'add-product',
  'update-product',
  'toggle-product-status',
])

const showAddForm = ref(false)
const searchText = ref('')
const searchError = ref('')
const selectedCategory = ref('')
const selectedPlatform = ref('')
const selectedProduct = ref(null)
const editModal = ref(null)

const hasActiveFilters = computed(() => {
  return Boolean(
    searchText.value
    || selectedCategory.value
    || selectedPlatform.value,
  )
})

const filteredProducts = computed(() => {
  return props.products.filter((product) => {
    const matchesSearch = productMatchesSearch(
      product,
      searchText.value,
    )

    const matchesCategory =
      !selectedCategory.value
      || product.category === selectedCategory.value

    const matchesPlatform =
      !selectedPlatform.value
      || product.platform === selectedPlatform.value

    return (
      matchesSearch
      && matchesCategory
      && matchesPlatform
    )
  })
})

function updateSearch(value) {
  const sanitizedSearch = sanitizeProductSearch(value)

  searchText.value = sanitizedSearch.value
  searchError.value = sanitizedSearch.error
}

function clearFilters() {
  searchText.value = ''
  searchError.value = ''
  selectedCategory.value = ''
  selectedPlatform.value = ''
}

function saveNewProduct(productData) {
  emit('add-product', productData)
  showAddForm.value = false
}

async function editProduct(product) {
  selectedProduct.value = product

  await nextTick()
  editModal.value?.show()
}
</script>

<template>
  <section
    class="admin-product-section bg-white p-3 p-md-4"
    aria-labelledby="admin-products-title"
  >
    <div
      class="d-flex flex-column flex-md-row align-items-md-center
             justify-content-between gap-3 mb-4"
    >
      <div>
        <h2
          id="admin-products-title"
          class="fs-4 mb-2"
        >
          Productos
        </h2>

        <p class="small mb-0">
          Registra, edita, activa o desactiva los productos de PixelVault.
        </p>
      </div>

      <button
        class="add-product-button btn align-self-start"
        type="button"
        :aria-expanded="showAddForm"
        aria-controls="admin-add-product-form"
        @click="showAddForm = !showAddForm"
      >
        {{ showAddForm ? 'Ocultar formulario' : 'Agregar producto' }}
      </button>
    </div>

    <div id="admin-add-product-form">
      <AdminProductForm
        v-if="showAddForm"
        :categories="categories"
        :platforms="platforms"
        @save="saveNewProduct"
        @cancel="showAddForm = false"
      />
    </div>

    <form
      class="admin-search mb-4"
      role="search"
      @submit.prevent
    >
      <label
        for="admin-product-search"
        class="form-label"
      >
        Buscar productos
      </label>

      <div class="admin-search__wrapper">
        <input
          id="admin-product-search"
          class="form-control nes-input"
          :class="{ 'is-invalid': searchError }"
          type="search"
          :value="searchText"
          placeholder="Buscar por nombre, categoría o plataforma"
          autocomplete="off"
          maxlength="60"
          :aria-invalid="Boolean(searchError)"
          aria-describedby="admin-product-search-error"
          @input="updateSearch($event.target.value)"
          @keydown.esc="clearFilters"
        >

        <img
          :src="searchIcon"
          class="admin-search__icon"
          alt=""
          width="28"
          height="28"
          aria-hidden="true"
        >
      </div>

      <p
        v-if="searchError"
        id="admin-product-search-error"
        class="text-danger small mt-2 mb-0"
        role="alert"
      >
        {{ searchError }}
      </p>
    </form>

    <ProductFilter
      id-prefix="admin-product"
      title="Filtrar inventario"
      :categories="categories"
      :platforms="platforms"
      :search-text="searchText"
      :selected-category="selectedCategory"
      :selected-platform="selectedPlatform"
      :result-count="filteredProducts.length"
      :has-active-filters="hasActiveFilters"
      @update:selected-category="selectedCategory = $event"
      @update:selected-platform="selectedPlatform = $event"
      @clear-filters="clearFilters"
    />

    <div
      v-if="filteredProducts.length === 0"
      class="admin-products-empty bg-warning-subtle
             p-4 p-md-5 text-center"
      role="status"
    >
      <h3 class="fs-5 mb-3">
        No se encontraron productos
      </h3>

      <p class="small mb-0">
        Intenta con otro nombre, categoría o plataforma.
      </p>
    </div>

    <div
      v-else
      class="row g-4"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="col-12 col-md-6 col-xl-4"
      >
        <AdminProductCard
          :product="product"
          @edit="editProduct"
          @toggle-status="emit('toggle-product-status', $event)"
        />
      </div>
    </div>

    <AdminEditProductModal
      ref="editModal"
      :product="selectedProduct"
      :categories="categories"
      :platforms="platforms"
      @save="emit('update-product', $event)"
    />
  </section>
</template>

<style scoped>
.admin-product-section {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.add-product-button {
  min-height: 52px;
  border: 3px solid #111;
  border-radius: 0;
  background-color: #54b3ea;
  box-shadow: 3px 3px 0 #111;
  color: #111;
  font-family: inherit;
  font-size: 0.62rem;
}

.add-product-button:hover,
.add-product-button:focus-visible {
  background-color: #feb914;
  outline: 3px solid #111;
  outline-offset: 2px;
}

.admin-search__wrapper {
  position: relative;
}

.admin-search .form-label {
  font-size: 0.68rem;
}

.admin-search .form-control {
  min-height: 54px;
  padding-right: 3.25rem;
  border-radius: 0;
  font-family: inherit;
  font-size: 0.68rem;
}

.admin-search .form-control.is-invalid {
  background-image: none;
}

.admin-search__icon {
  position: absolute;
  top: 50%;
  right: 0.9rem;
  pointer-events: none;
  transform: translateY(-50%);
}

.admin-products-empty {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}
</style>
