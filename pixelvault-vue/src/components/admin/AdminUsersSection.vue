<script setup>
import { onMounted, ref } from 'vue'

import AdminUserForm from './AdminUserForm.vue'

import { useUsers } from '../../composables/useUsers'

const emit = defineEmits([
  'feedback',
])

const {
  users,
  loadingUsers,
  usersError,
  loadUsers,
  createAdminUser,
  deactivateUser,
  clearUsersError,
} = useUsers()

const showAddForm = ref(false)
const formSubmitting = ref(false)
const formError = ref('')

function toggleAddForm() {
  showAddForm.value = !showAddForm.value
  formError.value = ''
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('es-CR')
}

async function handleCreateAdmin(userData) {
  formSubmitting.value = true
  formError.value = ''

  try {
    const user = await createAdminUser(userData)
    showAddForm.value = false

    emit('feedback', {
      type: 'success',
      message: `${user.name} se registró como administrador correctamente.`,
    })
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'No fue posible crear el administrador.'

    formError.value = message
    emit('feedback', { type: 'danger', message })
  } finally {
    formSubmitting.value = false
  }
}

async function handleDeactivateUser(user) {
  try {
    const updated = await deactivateUser(user.id)

    emit('feedback', {
      type: 'success',
      message: `${updated.name} se desactivó correctamente.`,
    })
  } catch (error) {
    emit('feedback', {
      type: 'danger',
      message: error instanceof Error ? error.message : 'No fue posible desactivar al usuario.',
    })
    clearUsersError()
  }
}

function retryUsers() {
  loadUsers({ force: true }).catch(() => {})
}

onMounted(() => {
  loadUsers().catch(() => {})
})
</script>

<template>
  <section
    class="admin-users-section bg-white p-3 p-md-4"
    aria-labelledby="admin-users-title"
  >
    <div
      class="d-flex flex-column flex-md-row align-items-md-center
             justify-content-between gap-3 mb-4"
    >
      <div>
        <h2
          id="admin-users-title"
          class="fs-4 mb-2"
        >
          Usuarios
        </h2>

        <p class="small mb-0">
          Administra las cuentas de PixelVault y crea nuevos administradores.
        </p>
      </div>

      <button
        class="add-product-button btn align-self-start"
        type="button"
        :aria-expanded="showAddForm"
        aria-controls="admin-add-user-form"
        @click="toggleAddForm"
      >
        {{ showAddForm ? 'Ocultar formulario' : 'Agregar administrador' }}
      </button>
    </div>

    <div id="admin-add-user-form">
      <AdminUserForm
        v-if="showAddForm"
        :submitting="formSubmitting"
        :error="formError"
        @submit="handleCreateAdmin"
        @cancel="toggleAddForm"
      />
    </div>

    <div v-if="loadingUsers" class="admin-api-state p-5 text-center" role="status">
      Cargando usuarios desde MongoDB...
    </div>

    <div v-else-if="usersError" class="alert alert-danger admin-section-alert" role="alert">
      <p class="mb-3">{{ usersError }}</p>

      <button class="nes-btn is-primary" type="button" @click="retryUsers">
        Reintentar conexión
      </button>
    </div>

    <div
      v-else-if="users.length === 0"
      class="admin-products-empty bg-warning-subtle
             p-4 p-md-5 text-center"
      role="status"
    >
      <h3 class="fs-5 mb-3">
        No hay usuarios registrados
      </h3>

      <p class="small mb-0">
        Los usuarios aparecerán aquí cuando se registren.
      </p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-bordered align-middle admin-table mb-0">
        <thead>
          <tr>
            <th scope="col">Usuario</th>
            <th scope="col">Correo</th>
            <th scope="col">Rol</th>
            <th scope="col">Estado</th>
            <th scope="col">Creado</th>
            <th scope="col" class="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>

            <td>{{ user.email }}</td>

            <td>
              <span
                class="admin-badge"
                :class="user.role === 'admin' ? 'admin-badge--admin' : 'admin-badge--customer'"
              >
                {{ user.role === 'admin' ? 'Administrador' : 'Cliente' }}
              </span>
            </td>

            <td>
              <span
                class="admin-badge"
                :class="user.status === false ? 'admin-badge--inactive' : 'admin-badge--active'"
              >
                {{ user.status === false ? 'Inactivo' : 'Activo' }}
              </span>
            </td>

            <td>{{ formatDate(user.createdAt) }}</td>

            <td class="text-end">
              <button
                v-if="user.status !== false"
                class="status-product-button btn is-deactivate"
                type="button"
                :aria-label="'Desactivar a ' + user.name"
                @click="handleDeactivateUser(user)"
              >
                Desactivar
              </button>

              <span v-else class="small text-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.admin-users-section {
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

.admin-badge--admin {
  background-color: #54b3ea;
}

.admin-badge--customer {
  background-color: #fff1d7;
}

.admin-badge--active {
  background-color: #92cc41;
}

.admin-badge--inactive {
  background-color: #e76e55;
  color: #fff;
}

.status-product-button {
  min-height: 44px;
  padding: 0.4rem 0.75rem;
  border: 3px solid #111;
  border-radius: 1rem;
  background-color: #e76e55;
  color: #fff;
  font-family: inherit;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.status-product-button:hover,
.status-product-button:focus-visible {
  background-color: #feb914;
  color: #111;
  outline: 3px solid #111;
  outline-offset: 3px;
}
</style>
