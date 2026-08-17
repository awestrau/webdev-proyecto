<script setup>
import { computed } from 'vue'

import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'edit',
  'toggle-status',
])

const mainImage = computed(() => {
  return props.product.images?.[0] ?? ''
})

</script>

<template>
  <article
    class="admin-product-card d-flex flex-column h-100
           p-3 bg-warning-subtle"
    :class="{ 'admin-product-card--inactive': product.status === false }"
  >
    <header class="text-center mb-3">
      <h3 class="admin-product-card__name mb-2">
        {{ product.name }}
      </h3>

      <p class="admin-product-card__meta mb-1">
        {{ product.platform }}
      </p>

      <p class="admin-product-card__meta mb-0">
        {{ product.category }}
      </p>

      <span
        class="admin-product-card__status d-inline-block mt-2"
        :class="product.status === false ? 'is-inactive' : 'is-active'"
      >
        {{ product.status === false ? 'Inactivo' : 'Activo' }}
      </span>
    </header>

    <div
      class="admin-product-card__image d-flex
             align-items-center justify-content-center mb-3"
    >
      <img
        v-if="mainImage"
        :src="mainImage"
        :alt="product.name"
      >

      <span
        v-else
        class="small text-center p-3"
      >
        Imagen no disponible
      </span>
    </div>

    <p class="admin-product-card__price text-center mb-3">
      {{ formatCurrency(product.price) }}
    </p>

    <div class="d-grid gap-2 mt-auto">
      <button
        class="edit-product-button btn"
        type="button"
        :aria-label="'Editar ' + product.name"
        @click="emit('edit', product)"
      >
        Editar producto
      </button>

      <button
        class="status-product-button btn"
        :class="product.status === false ? 'is-activate' : 'is-deactivate'"
        type="button"
        :aria-label="(product.status === false ? 'Activar ' : 'Desactivar ') + product.name"
        @click="emit('toggle-status', product)"
      >
        {{ product.status === false ? 'Activar producto' : 'Desactivar producto' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.admin-product-card {
  width: 100%;
  max-width: 390px;
  margin-inline: auto;
  border-radius: 1.5rem;
  color: #151515;
}

.admin-product-card--inactive {
  background-color: #e9ecef !important;
}

.admin-product-card__status {
  padding: 0.3rem 0.5rem;
  border: 2px solid #111;
  font-size: 0.52rem;
  line-height: 1.4;
}

.admin-product-card__status.is-active {
  background-color: #92cc41;
}

.admin-product-card__status.is-inactive {
  background-color: #e76e55;
  color: #fff;
}

.admin-product-card__name {
  min-height: 2.6rem;
  font-size: 0.78rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.admin-product-card__meta {
  font-size: 0.6rem;
  line-height: 1.5;
}

.admin-product-card__image {
  overflow: hidden;
}

.admin-product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.admin-product-card__price {
  font-size: 0.72rem;
}

.edit-product-button {
  min-height: 56px;
  border: 3px solid #111;
  border-radius: 1.2rem;
  background-color: #54b3ea;
  color: #111;
  font-family: inherit;
  font-size: 0.6rem;
  text-transform: uppercase;
}

.edit-product-button:hover,
.edit-product-button:focus-visible {
  background-color: #feb914;
  outline: 3px solid #111;
  outline-offset: 3px;
}

.status-product-button {
  min-height: 50px;
  border: 3px solid #111;
  border-radius: 1.2rem;
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
