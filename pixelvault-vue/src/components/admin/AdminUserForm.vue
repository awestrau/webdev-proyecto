<script setup>
import { ref } from 'vue'

const props = defineProps({
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
  'submit',
  'cancel',
])

const formElement = ref(null)
const formData = ref({
  name: '',
  email: '',
  password: '',
})

function submitForm() {
  if (!formElement.value?.checkValidity()) {
    formElement.value?.reportValidity()
    return
  }

  emit('submit', {
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    password: formData.value.password,
  })
}
</script>

<template>
  <section
    class="admin-user-form bg-warning-subtle p-3 p-md-4 mb-4"
    aria-labelledby="add-admin-form-title"
  >
    <div
      class="d-flex align-items-start
             justify-content-between gap-3 mb-4"
    >
      <div>
        <h2
          id="add-admin-form-title"
          class="fs-5 mb-2"
        >
          Agregar administrador
        </h2>

        <p class="small mb-0">
          Crea una cuenta con permisos de administrador para PixelVault.
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
        <label for="admin-user-name" class="form-label">
          Nombre
        </label>

        <input
          id="admin-user-name"
          v-model="formData.name"
          class="form-control admin-form-control"
          type="text"
          placeholder="Nombre del administrador"
          required
          minlength="2"
          maxlength="80"
          autocomplete="off"
        >
      </div>

      <div class="mb-3">
        <label for="admin-user-email" class="form-label">
          Correo electrónico
        </label>

        <input
          id="admin-user-email"
          v-model="formData.email"
          class="form-control admin-form-control"
          type="email"
          placeholder="admin@ejemplo.com"
          required
          maxlength="120"
          autocomplete="off"
        >
      </div>

      <div class="mb-3">
        <label for="admin-user-password" class="form-label">
          Contraseña
        </label>

        <input
          id="admin-user-password"
          v-model="formData.password"
          class="form-control admin-form-control"
          type="password"
          placeholder="Mínimo 8 caracteres"
          required
          minlength="8"
          maxlength="100"
          autocomplete="new-password"
        >
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
          {{ submitting ? 'Guardando...' : 'Guardar administrador' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.admin-user-form {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.admin-user-form .form-label {
  font-size: 0.68rem;
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
