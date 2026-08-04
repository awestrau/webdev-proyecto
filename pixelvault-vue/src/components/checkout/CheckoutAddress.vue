<script setup>
import { computed } from 'vue'

import AddressList from './AddressList.vue'
import AddressForm from './AddressForm.vue'
import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
  addresses: {
    type: Array,
    required: true,
  },

  selectedAddressId: {
    type: [Number, String],
    default: null,
  },

  shippingOptions: {
    type: Array,
    required: true,
  },

  selectedShippingId: {
    type: [Number, String],
    default: null,
  },

  productCount: {
    type: Number,
    default: 0,
  },

  productsTotal: {
    type: Number,
    default: 0,
  },

  shippingCost: {
    type: Number,
    default: 0,
  },

  orderTotal: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits([
  'select-address',
  'add-address',
  'select-shipping',
  'continue-payment',
  'back-cart',
])

const selectedShipping = computed(() => {
  return props.shippingOptions.find((option) => {
    return option.id === props.selectedShippingId
  }) ?? null
})

const canContinue = computed(() => {
  return Boolean(props.selectedAddressId && props.selectedShippingId)
})
</script>

<template>
  <section aria-label="Selección de dirección y envío">
    <div class="row g-3 align-items-start">
      <!-- Direcciones y envío -->
      <div class="col-12 col-lg-8">
        <div class="checkout-address-panel bg-secondary-subtle p-3 p-md-4">
          <AddressList
            :addresses="addresses"
            :selected-address-id="selectedAddressId"
            @select-address="emit('select-address', $event)"
          />

          <AddressForm
            @save-address="emit('add-address', $event)"
          />

          <hr class="checkout-divider my-4">

          <!-- Método de envío -->
          <section aria-labelledby="shipping-title">
            <h2
              id="shipping-title"
              class="fs-2 mb-3 text-uppercase"
            >
              Envío
            </h2>

            <div class="d-flex flex-column gap-3">
              <div
                v-for="option in shippingOptions"
                :key="option.id"
                class="form-check shipping-option p-3"
                :class="{
                  'shipping-option--selected':
                    selectedShippingId === option.id,
                }"
              >
                <input
                  :id="`shipping-${option.id}`"
                  class="form-check-input"
                  type="radio"
                  name="shipping-method"
                  :value="option.id"
                  :checked="selectedShippingId === option.id"
                  @change="emit('select-shipping', option.id)"
                >

                <label
                  class="form-check-label w-100 ps-2"
                  :for="`shipping-${option.id}`"
                >
                  <strong class="d-block mb-1">
                    {{ option.label }} -
                    {{ option.description }}
                  </strong>

                  <span>
                    {{ formatCurrency(option.cost) }}
                  </span>
                </label>
              </div>
            </div>
          </section>

          <button
            class="btn btn-secondary mt-4"
            type="button"
            @click="emit('back-cart')"
          >
            Volver al carrito
          </button>
        </div>
      </div>

      <!-- Resumen -->
      <div class="col-12 col-lg-4">
        <aside
          class="checkout-summary bg-secondary-subtle p-3 p-md-4"
          aria-labelledby="checkout-summary-title"
        >
          <h2
            id="checkout-summary-title"
            class="checkout-summary__title mb-4"
          >
            Resumen del pedido
          </h2>

          <ul class="mb-4 ps-4 small">
            <li class="mb-2">
              {{ productCount }}
              {{ productCount === 1 ? 'producto' : 'productos' }}
            </li>

            <li>
              {{ selectedShipping?.label ?? 'Envío sin seleccionar' }}
            </li>
          </ul>

          <hr class="checkout-divider my-4">

          <dl class="d-flex flex-column gap-3 mb-4">
            <div class="d-flex justify-content-between gap-3">
              <dt>Productos</dt>
              <dd class="mb-0">
                {{ formatCurrency(productsTotal) }}
              </dd>
            </div>

            <div class="d-flex justify-content-between gap-3">
              <dt>Envío</dt>
              <dd class="mb-0">
                +{{ formatCurrency(shippingCost) }}
              </dd>
            </div>

            <div class="checkout-summary__total d-flex justify-content-between gap-3">
              <dt>Total</dt>
              <dd class="mb-0">
                {{ formatCurrency(orderTotal) }}
              </dd>
            </div>
          </dl>

          <button
            class="continue-payment-button btn w-100 py-3"
            type="button"
            :disabled="!canContinue"
            @click="emit('continue-payment')"
          >
            Continuar a pago
          </button>

          <p
            v-if="!canContinue"
            class="small text-danger mt-3 mb-0"
            role="status"
          >
            Selecciona una dirección y un método de envío.
          </p>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.checkout-address-panel,
.checkout-summary {
  color: #151515;
}

.checkout-divider {
  border: 0;
  border-top: 5px solid #111;
  opacity: 1;
}

.shipping-option {
  border: 3px solid transparent;
}

.shipping-option--selected {
  border-color: #111;
  background-color: #fff1d7;
}

.shipping-option .form-check-input {
  width: 1.4rem;
  height: 1.4rem;
  margin-left: 0;
}

.shipping-option .form-check-label {
  cursor: pointer;
  font-size: 0.7rem;
  line-height: 1.6;
}

.checkout-summary__title {
  font-size: 0.9rem;
}

.checkout-summary dt,
.checkout-summary dd {
  font-size: 0.8rem;
  font-weight: normal;
}

.checkout-summary__total dt,
.checkout-summary__total dd {
  font-size: 0.95rem;
  font-weight: bold;
}

.continue-payment-button {
  border: 3px solid #111;
  background-color: #54b3ea;
  box-shadow: 4px 4px 0 #111;
  color: #111;
  font-family: inherit;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.continue-payment-button:hover:not(:disabled),
.continue-payment-button:focus-visible:not(:disabled) {
  background-color: #feb914;
  outline: 3px solid #111;
  outline-offset: 3px;
}

.continue-payment-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 992px) {
  .checkout-summary {
    position: sticky;
    top: 8rem;
  }
}
</style>