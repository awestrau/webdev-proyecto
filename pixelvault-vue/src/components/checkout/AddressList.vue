<script setup>
import { computed } from 'vue'

import AddressCard from './AddressCard.vue'

const props = defineProps({
  addresses: {
    type: Array,
    required: true,
  },

  selectedAddressId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['select-address'])

const addressCountLabel = computed(() => {
  const count = props.addresses.length
  const word = count === 1 ? 'dirección guardada' : 'direcciones guardadas'

  return `${count} ${word}`
})
</script>

<template>
  <section aria-labelledby="addresses-title">
    <div class="d-flex flex-wrap align-items-baseline gap-2 mb-4">
      <h1
        id="addresses-title"
        class="m-0 fs-2 text-uppercase"
      >
        Mis direcciones
      </h1>

      <span
        class="small text-uppercase"
        aria-live="polite"
      >
        ({{ addressCountLabel }})
      </span>
    </div>

    <div
      v-if="addresses.length === 0"
      class="alert alert-warning mb-4"
      role="status"
    >
      No tienes direcciones guardadas. Agrega una dirección para continuar.
    </div>

    <div
      v-else
      class="row g-3 mb-4"
    >
      <div
        v-for="address in addresses"
        :key="address.id"
        class="col-12 col-md-6 col-xl-4"
      >
        <AddressCard
          :address="address"
          :selected="selectedAddressId === address.id"
          @select="emit('select-address', $event)"
        />
      </div>
    </div>

    <button
      class="add-address-button btn btn-link p-0 border-0 text-decoration-none"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#address-form-modal"
    >
      + Agregar nueva dirección
    </button>
  </section>
</template>

<style scoped>
.add-address-button {
  color: #0000dd;
  font-family: inherit;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.add-address-button:hover,
.add-address-button:focus-visible {
  color: #111;
  background-color: #feb914;
  outline: 3px solid #111;
  outline-offset: 3px;
}
</style>