<script setup>
import { computed, onMounted, ref } from 'vue'

import AdminCategoryForm from './AdminCategoryForm.vue'

import { useCategories } from '../../composables/useCategories'

const emit = defineEmits([
  'feedback',
])

const {
  categories,
  loadingCategories,
  categoriesError,
  loadCategories,
  createCategory,
  updateCategory,
  setCategoryStatus,
  clearCategoriesError,
} = useCategories()

const showForm = ref(false)
const editingCategory = ref(null)
const formSubmitting = ref(false)
const formError = ref('')

const isFormVisible = computed(() => showForm.value)

function toggleForm() {
  showForm.value = !showForm.value
  editingCategory.value = null
  formError.value = ''
}

function startEdit(category) {
  editingCategory.value = category
  showForm.value = true
  formError.value = ''
}

async function handleSave(categoryData) {
  formSubmitting.value = true
  formError.value = ''

  try {
    if (categoryData.id) {
      const updated = await updateCategory(categoryData)

      emit('feedback', {
        type: 'success',
        message: `${updated.name} se actualizó correctamente.`,
      })
    } else {
      const created = await createCategory(categoryData)

      emit('feedback', {
        type: 'success',
        message: `${created.name} se registró correctamente.`,
      })
    }

    showForm.value = false
    editingCategory.value = null
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'No fue posible guardar la categoría.'

    formError.value = message
    emit('feedback', { type: 'danger', message })
  } finally {
    formSubmitting.value = false
  }
}

async function handleToggleStatus(category) {
  try {
    const updated = await setCategoryStatus(
      category.id,
      category.status === false,
    )

    emit('feedback', {
      type: 'success',
      message: updated.status
        ? `${updated.name} se activó correctamente.`
        : `${updated.name} se desactivó correctamente.`,
    })
  } catch (error) {
    emit('feedback', {
      type: 'danger',
      message: error instanceof Error ? error.message : 'No fue posible actualizar la categoría.',
    })
    clearCategoriesError()
  }
}

function retryCategories() {
  loadCategories({ force: true }).catch(() => {})
}

onMounted(() => {
  loadCategories().catch(() => {})
})
</script>

<template>
  <section
    class="admin-categories-section bg-white p-3 p-md-4"
    aria-labelledby="admin-categories-title"
  >
    <div
      class="d-flex flex-column flex-md-row align-items-md-center
             justify-content-between gap-3 mb-4"
    >
      <div>
        <h2
          id="admin-categories-title"
          class="fs-4 mb-2"
        >
          Categorías
        </h2>

        <p class="small mb-0">
          Crea, edita, activa o desactiva las categorías de PixelVault.
        </p>
      </div>

      <button
        class="add-product-button btn align-self-start"
        type="button"
        :aria-expanded="isFormVisible"
        aria-controls="admin-category-form"
        @click="toggleForm"
      >
        {{ isFormVisible ? 'Ocultar formulario' : 'Agregar categoría' }}
      </button>
    </div>

    <div id="admin-category-form">
      <AdminCategoryForm
        v-if="isFormVisible"
        :key="editingCategory?.id || 'new'"
        :category="editingCategory"
        :submitting="formSubmitting"
        :error="formError"
        @save="handleSave"
        @cancel="toggleForm"
      />
    </div>

    <div v-if="loadingCategories" class="admin-api-state p-5 text-center" role="status">
      Cargando categorías desde MongoDB...
    </div>

    <div v-else-if="categoriesError" class="alert alert-danger admin-section-alert" role="alert">
      <p class="mb-3">{{ categoriesError }}</p>

      <button class="nes-btn is-primary" type="button" @click="retryCategories">
        Reintentar conexión
      </button>
    </div>

    <div
      v-else-if="categories.length === 0"
      class="admin-products-empty bg-warning-subtle
             p-4 p-md-5 text-center"
      role="status"
    >
      <h3 class="fs-5 mb-3">
        No hay categorías registradas
      </h3>

      <p class="small mb-0">
        Las categorías aparecerán aquí cuando se registren.
      </p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-bordered align-middle admin-table mb-0">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Slug</th>
            <th scope="col">Descripción</th>
            <th scope="col">Estado</th>
            <th scope="col" class="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.name }}</td>

            <td>
              <code class="small">{{ category.slug }}</code>
            </td>

            <td>{{ category.description || '—' }}</td>

            <td>
              <span
                class="admin-badge"
                :class="category.status === false ? 'admin-badge--inactive' : 'admin-badge--active'"
              >
                {{ category.status === false ? 'Inactiva' : 'Activa' }}
              </span>
            </td>

            <td class="text-end">
              <div class="d-flex gap-2 justify-content-end">
                <button
                  class="edit-category-button btn"
                  type="button"
                  :aria-label="'Editar ' + category.name"
                  @click="startEdit(category)"
                >
                  Editar
                </button>

                <button
                  class="status-product-button btn"
                  :class="category.status === false ? 'is-activate' : 'is-deactivate'"
                  type="button"
                  :aria-label="(category.status === false ? 'Activar ' : 'Desactivar ') + category.name"
                  @click="handleToggleStatus(category)"
                >
                  {{ category.status === false ? 'Activar' : 'Desactivar' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.admin-categories-section {
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

.admin-api-state {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  background-color: #fff1d7;
  font-size: 0.68rem;
  line-height: 1.8;
}

.admin-section-alert {
  border: 3px solid #111;
  border-radius: 0;
  box-shadow: 3px 3px 0 #111;
  font-size: 0.68rem;
}

.admin-products-empty {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.admin-table {
  border: 3px solid #111;
  font-size: 0.66rem;
}

.admin-table th {
  border: 2px solid #111;
  background-color: #54b3ea;
  color: #111;
  font-size: 0.6rem;
  text-transform: uppercase;
  white-space: nowrap;
}

.admin-table td {
  border: 2px solid #111;
}

.admin-badge {
  display: inline-block;
  padding: 0.3rem 0.5rem;
  border: 2px solid #111;
  font-size: 0.55rem;
  line-height: 1.4;
  white-space: nowrap;
}

.admin-badge--active {
  background-color: #92cc41;
}

.admin-badge--inactive {
  background-color: #e76e55;
  color: #fff;
}

.edit-category-button {
  min-height: 44px;
  padding: 0.4rem 0.75rem;
  border: 3px solid #111;
  border-radius: 1rem;
  background-color: #54b3ea;
  color: #111;
  font-family: inherit;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.edit-category-button:hover,
.edit-category-button:focus-visible {
  background-color: #feb914;
  outline: 3px solid #111;
  outline-offset: 3px;
}

.status-product-button {
  min-height: 44px;
  padding: 0.4rem 0.75rem;
  border: 3px solid #111;
  border-radius: 1rem;
  color: #111;
  font-family: inherit;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.status-product-button.is-deactivate {
  background-color: #e76e55;
  color: #fff;
}

.status-product-button.is-activate {
  background-color: #92cc41;
}

.status-product-button:hover,
.status-product-button:focus-visible {
  background-color: #feb914;
  color: #111;
  outline: 3px solid #111;
  outline-offset: 3px;
}
</style>
