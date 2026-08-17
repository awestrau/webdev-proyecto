<script setup>
import { ref } from 'vue'

import ProductFormFields from './ProductFormFields.vue'

defineProps({
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
  'cancel',
])

function createEmptyProduct() {
  return {
    name: '',
    price: '',
    platform: '',
    category: '',
    description: '',
    status: true,
    imageFiles: [],
    newImages: [],
    removeImageIds: [],
  }
}

const formElement = ref(null)
const formData = ref(createEmptyProduct())

function submitForm() {
  if (!formElement.value?.checkValidity()) {
    formElement.value?.reportValidity()
    return
  }

  emit('save', {
    ...formData.value,
    newImages: [...formData.value.newImages],
  })

  formData.value = createEmptyProduct()
}
</script>

<template>
  <section
    class="admin-product-form bg-warning-subtle p-3 p-md-4 mb-4"
    aria-labelledby="add-product-form-title"
  >
    <div
      class="d-flex align-items-start
             justify-content-between gap-3 mb-4"
    >
      <div>
        <h2
          id="add-product-form-title"
          class="fs-5 mb-2"
        >
          Registrar producto
        </h2>

        <p class="small mb-0">
          Completa la información que se mostrará en el catálogo.
        </p>
      </div>

      <button
        class="btn-close"
        type="button"
        aria-label="Ocultar formulario"
        @click="emit('cancel')"
      />
    </div>

    <form
      ref="formElement"
      @submit.prevent="submitForm"
    >
      <ProductFormFields
        v-model="formData"
        id-prefix="add-product"
        :categories="categories"
        :platforms="platforms"
      />

      <div
        class="d-flex flex-column flex-sm-row
               justify-content-end gap-3 mt-4"
      >
        <button
          class="btn btn-secondary"
          type="button"
          @click="emit('cancel')"
        >
          Cancelar
        </button>

        <button
          class="save-product-button btn"
          type="submit"
        >
          Guardar producto
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.admin-product-form {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
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
