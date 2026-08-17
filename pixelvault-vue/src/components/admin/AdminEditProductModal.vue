<script setup>
import {
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'
import Modal from 'bootstrap/js/dist/modal'

import ProductFormFields from './ProductFormFields.vue'

const props = defineProps({
  product: {
    type: Object,
    default: null,
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
  'save',
])

const modalElement = ref(null)
const formElement = ref(null)
const formData = ref(null)

function cloneProduct(product) {
  if (!product) {
    return null
  }

  return {
    ...product,
    imageFiles: [...(product.imageFiles ?? [])],
    newImages: [],
    removeImageIds: [],
  }
}

watch(
  () => props.product,
  (selectedProduct) => {
    formData.value = cloneProduct(selectedProduct)
  },
  {
    immediate: true,
  },
)

function show() {
  if (!modalElement.value) {
    return
  }

  Modal.getOrCreateInstance(modalElement.value).show()
}

function hide() {
  if (!modalElement.value) {
    return
  }

  Modal.getOrCreateInstance(modalElement.value).hide()
}

function submitForm() {
  if (!formElement.value?.checkValidity()) {
    formElement.value?.reportValidity()
    return
  }

  emit('save', {
    ...formData.value,
    newImages: [...(formData.value.newImages ?? [])],
    removeImageIds: [...(formData.value.removeImageIds ?? [])],
  })

  hide()
}

onBeforeUnmount(() => {
  Modal.getInstance(modalElement.value)?.dispose()
})

defineExpose({
  show,
})
</script>

<template>
  <div
    ref="modalElement"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="edit-product-modal-title"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered
             modal-dialog-scrollable modal-xl"
    >
      <div class="modal-content admin-edit-modal">
        <div class="modal-header">
          <h2
            id="edit-product-modal-title"
            class="modal-title fs-5"
          >
            Editar producto
          </h2>

          <button
            class="btn-close"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Cerrar"
          />
        </div>

        <form
          v-if="formData"
          ref="formElement"
          @submit.prevent="submitForm"
        >
          <div class="modal-body p-3 p-md-4">
            <ProductFormFields
              v-model="formData"
              id-prefix="edit-product"
              :categories="categories"
              :platforms="platforms"
            />
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              type="button"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>

            <button
              class="save-product-button btn"
              type="submit"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-edit-modal {
  border: 4px solid #111;
  border-radius: 0;
  box-shadow: 6px 6px 0 #111;
}

.save-product-button {
  border: 3px solid #111;
  border-radius: 0;
  background-color: #54b3ea;
  box-shadow: 3px 3px 0 #111;
  color: #111;
  font-family: inherit;
  font-size: 0.66rem;
}

.save-product-button:hover,
.save-product-button:focus-visible {
  background-color: #feb914;
  outline: 3px solid #111;
  outline-offset: 2px;
}
</style>
