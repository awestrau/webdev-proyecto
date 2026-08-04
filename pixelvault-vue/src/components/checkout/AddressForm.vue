<script setup>
import { reactive, ref } from 'vue'
import Modal from 'bootstrap/js/dist/modal'

const emit = defineEmits(['save-address'])

const modalElement = ref(null)
const formElement = ref(null)

const formData = reactive({
  country: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  zipCode: '',
})

function resetForm() {
  Object.assign(formData, {
    country: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
  })

  formElement.value?.classList.remove('was-validated')
}

function saveAddress() {
  if (!formElement.value?.checkValidity()) {
    formElement.value?.classList.add('was-validated')
    return
  }

  emit('save-address', {
    country: formData.country.trim(),
    phone: formData.phone.trim(),
    addressLine: formData.addressLine.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    zipCode: formData.zipCode.trim(),
  })

  const modal = Modal.getOrCreateInstance(modalElement.value)

  modal.hide()
  resetForm()
}
</script>

<template>
  <div
    id="address-form-modal"
    ref="modalElement"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="address-form-title"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content address-modal">
        <div class="modal-header">
          <h2
            id="address-form-title"
            class="modal-title fs-5"
          >
            Agregar nueva dirección
          </h2>

          <button
            class="btn-close"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Cerrar"
            @click="resetForm"
          />
        </div>

        <form
          ref="formElement"
          novalidate
          @submit.prevent="saveAddress"
        >
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label
                  for="address-country"
                  class="form-label"
                >
                  País
                </label>

                <input
                  id="address-country"
                  v-model="formData.country"
                  class="form-control nes-input"
                  type="text"
                  required
                >

                <div class="invalid-feedback">
                  Ingresa el país.
                </div>
              </div>

              <div class="col-12 col-md-6">
                <label
                  for="address-phone"
                  class="form-label"
                >
                  Número de teléfono
                </label>

                <input
                  id="address-phone"
                  v-model="formData.phone"
                  class="form-control nes-input"
                  type="tel"
                  inputmode="tel"
                  required
                >

                <div class="invalid-feedback">
                  Ingresa un número de teléfono.
                </div>
              </div>

              <div class="col-12">
                <label
                  for="address-line"
                  class="form-label"
                >
                  Dirección exacta
                </label>

                <textarea
                  id="address-line"
                  v-model="formData.addressLine"
                  class="form-control nes-textarea"
                  rows="3"
                  required
                />

                <div class="invalid-feedback">
                  Ingresa la dirección exacta.
                </div>
              </div>

              <div class="col-12 col-md-4">
                <label
                  for="address-city"
                  class="form-label"
                >
                  Ciudad
                </label>

                <input
                  id="address-city"
                  v-model="formData.city"
                  class="form-control nes-input"
                  type="text"
                  required
                >

                <div class="invalid-feedback">
                  Ingresa la ciudad.
                </div>
              </div>

              <div class="col-12 col-md-4">
                <label
                  for="address-state"
                  class="form-label"
                >
                  Estado o provincia
                </label>

                <input
                  id="address-state"
                  v-model="formData.state"
                  class="form-control nes-input"
                  type="text"
                  required
                >

                <div class="invalid-feedback">
                  Ingresa el estado o provincia.
                </div>
              </div>

              <div class="col-12 col-md-4">
                <label
                  for="address-zip-code"
                  class="form-label"
                >
                  Código postal
                </label>

                <input
                  id="address-zip-code"
                  v-model="formData.zipCode"
                  class="form-control nes-input"
                  type="text"
                  inputmode="numeric"
                  required
                >

                <div class="invalid-feedback">
                  Ingresa el código postal.
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="nes-btn"
              type="button"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              Cancelar
            </button>

            <button
              class="save-address-button nes-btn is-primary"
              type="submit"
            >
              Guardar dirección
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.address-modal {
  border: 4px solid #111;
  border-radius: 0;
  box-shadow: 6px 6px 0 #111;
}

.address-modal .modal-header {
  background-color: #feb914;
  color: #111;
  border-bottom: 3px solid #111;
}

.address-modal .modal-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.7rem;
  line-height: 1.8;
  text-transform: uppercase;
}

.form-label,
.modal-footer button {
  font-family: inherit;
}

.form-label {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.save-address-button {
  margin: 0;
  padding: 0.75rem 1.25rem;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.55rem;
  text-transform: uppercase;
}

/* Paleta del proyecto sobre el botón nes.css */
.address-modal .nes-btn.is-primary {
  background-color: #54b3ea;
  color: #111;
}

.address-modal .nes-btn.is-primary::after {
  box-shadow: inset -4px -4px #3a8ec7;
}

.address-modal .nes-btn.is-primary:hover,
.address-modal .nes-btn.is-primary:focus-visible {
  background-color: #feb914;
  color: #111;
}

.address-modal .nes-btn.is-primary:hover::after,
.address-modal .nes-btn.is-primary:focus-visible::after {
  box-shadow: inset -6px -6px #e5a800;
}

.address-modal .nes-btn.is-primary:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #3a8ec7;
}

.save-address-button:focus-visible {
  outline: 3px solid #111;
  outline-offset: 3px;
}
</style>