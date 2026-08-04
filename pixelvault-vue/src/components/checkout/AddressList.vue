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
        class="addresses-title m-0"
      >
        Mis direcciones
      </h1>

      <span
        class="addresses-count text-uppercase"
        aria-live="polite"
      >
        ({{ addressCountLabel }})
      </span>
    </div>

    <div
      v-if="addresses.length === 0"
      class="addresses-empty nes-container mb-4"
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
      class="add-address-button nes-btn is-primary"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#address-form-modal"
    >
      + Agregar nueva dirección
    </button>
  </section>
</template>

<style scoped>
.addresses-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.9rem;
  line-height: 1.8;
  text-transform: uppercase;
  color: #1a1f1f;
}

.addresses-count {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.5rem;
  color: #1a1f1f;
}

.addresses-empty {
  border: 3px solid #111;
  background-color: #fff1d7;
  color: #151515;
  font-size: 0.8rem;
  line-height: 1.6;
}

.add-address-button {
  margin: 0;
  padding: 0.75rem 1.25rem;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.55rem;
  line-height: 1.6;
  text-transform: uppercase;
}

/* Paleta del proyecto sobre el botón nes.css */
.add-address-button.nes-btn.is-primary {
  background-color: #54b3ea;
  color: #111;
}

.add-address-button.nes-btn.is-primary::after {
  box-shadow: inset -4px -4px #3a8ec7;
}

.add-address-button.nes-btn.is-primary:hover,
.add-address-button.nes-btn.is-primary:focus-visible {
  background-color: #feb914;
  color: #111;
}

.add-address-button.nes-btn.is-primary:hover::after,
.add-address-button.nes-btn.is-primary:focus-visible::after {
  box-shadow: inset -6px -6px #e5a800;
}

.add-address-button.nes-btn.is-primary:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #3a8ec7;
}

.add-address-button:focus-visible {
  outline: 3px solid #111;
  outline-offset: 3px;
}
</style>
