<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    default: null,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'save',
  'cancel',
])

const isEditMode = computed(() => Boolean(props.category))

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const formElement = ref(null)
const formData = ref({
  name: props.category?.name || '',
  slug: props.category?.slug || '',
  description: props.category?.description || '',
  status: props.category ? props.category.status !== false : true,
})

function syncSlug() {
  if (!formData.value.slug) {
    formData.value.slug = slugify(formData.value.name)
  }
}

function submitForm() {
  if (!formElement.value?.checkValidity()) {
    formElement.value?.reportValidity()
    return
  }

  const name = formData.value.name.trim()
  const payload = {
    name,
    slug: (formData.value.slug.trim() || slugify(name)),
    description: formData.value.description.trim(),
    status: formData.value.status,
  }

  if (isEditMode.value) {
    payload.id = props.category.id
  }

  emit('save', payload)
}
</script>

<template>
  <section
    class="admin-category-form bg-warning-subtle p-3 p-md-4 mb-4"
    :aria-labelledby="isEditMode ? 'edit-category-form-title' : 'add-category-form-title'"
  >
    <div
      class="d-flex align-items-start
             justify-content-between gap-3 mb-4"
    >
      <div>
        <h2
          :id="isEditMode ? 'edit-category-form-title' : 'add-category-form-title'"
          class="fs-5 mb-2"
        >
          {{ isEditMode ? 'Editar categoría' : 'Registrar categoría' }}
        </h2>

        <p class="small mb-0">
          {{ isEditMode
            ? 'Actualiza la información de la categoría.'
            : 'Completa la información de la nueva categoría.' }}
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
      <div class="mb-3">
        <label for="category-name" class="form-label">
          Nombre
        </label>

        <input
          id="category-name"
          v-model="formData.name"
          class="form-control admin-form-control"
          type="text"
          placeholder="Ej.: Consolas retro"
          required
          minlength="2"
          maxlength="80"
          autocomplete="off"
          @blur="syncSlug"
        >
      </div>

      <div class="mb-3">
        <label for="category-slug" class="form-label">
          Slug
        </label>

        <input
          id="category-slug"
          v-model="formData.slug"
          class="form-control admin-form-control"
          type="text"
          placeholder="Se genera solo desde el nombre"
          maxlength="60"
          autocomplete="off"
        >

        <p class="form-text small mb-0">
          Se genera automáticamente desde el nombre si lo dejás vacío.
        </p>
      </div>

      <div class="mb-3">
        <label for="category-description" class="form-label">
          Descripción
        </label>

        <textarea
          id="category-description"
          v-model="formData.description"
          class="form-control admin-form-control"
          rows="3"
          maxlength="400"
          placeholder="Descripción breve de la categoría"
        />
      </div>

      <div class="form-check mb-3">
        <input
          id="category-status"
          v-model="formData.status"
          class="form-check-input"
          type="checkbox"
        >

        <label for="category-status" class="form-check-label small">
          Categoría activa
        </label>
      </div>

      <div
        v-if="error"
        class="alert alert-danger admin-form-alert py-2 px-3"
        role="alert"
        aria-live="polite"
      >
        {{ error }}
      </div>

      <div
        class="d-flex flex-column flex-sm-row
               justify-content-end gap-3 mt-4"
      >
        <button
          class="btn btn-secondary"
          type="button"
          :disabled="submitting"
          @click="emit('cancel')"
        >
          Cancelar
        </button>

        <button
          class="save-product-button btn"
          type="submit"
          :disabled="submitting"
        >
          {{ submitting ? 'Guardando...' : (isEditMode ? 'Guardar cambios' : 'Guardar categoría') }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.admin-category-form {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.admin-category-form .form-label {
  font-size: 0.68rem;
}

.admin-category-form .form-text {
  font-size: 0.62rem;
}

.admin-form-control {
  min-height: 48px;
  border-radius: 0;
  font-family: inherit;
  font-size: 0.7rem;
}

.admin-form-alert {
  border: 3px solid #111;
  border-radius: 0;
  box-shadow: 3px 3px 0 #111;
  font-size: 0.66rem;
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

.save-product-button:disabled {
  background-color: #54b3ea;
  opacity: 0.65;
}
</style>
