<script setup>
defineProps({
  address: {
    type: Object,
    required: true,
  },

  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <button
    class="address-card btn w-100 h-100 p-3 p-md-4 text-start bg-warning-subtle"
    :class="{ 'address-card--selected': selected }"
    type="button"
    :aria-pressed="selected"
    :aria-label="`Seleccionar ${address.label}`"
    @click="emit('select', address.id)"
  >
    <h3 class="address-card__title mb-3 text-center">
      {{ address.label }}
    </h3>

    <dl class="address-card__details mb-0">
      <div class="mb-2">
        <dt>País:</dt>
        <dd>{{ address.country }}</dd>
      </div>

      <div class="mb-3">
        <dt>Número de teléfono:</dt>
        <dd>{{ address.phone }}</dd>
      </div>

      <div>
        <dt>Dirección:</dt>
        <dd>{{ address.addressLine }}</dd>

        <dt>Ciudad:</dt>
        <dd>{{ address.city }}</dd>

        <dt>Estado/provincia:</dt>
        <dd>{{ address.state }}</dd>

        <dt>Código postal:</dt>
        <dd>{{ address.zipCode }}</dd>
      </div>
    </dl>
  </button>
</template>

<style scoped>
.address-card {
  min-height: 275px;
  border: 4px solid transparent;
  border-radius: 1.5rem;
  color: #151515;
  font-family: inherit;
  transition:
    border-color 150ms ease,
    transform 150ms ease;
}

.address-card:hover,
.address-card:focus-visible {
  border-color: #777;
  transform: translateY(-2px);
}

.address-card--selected,
.address-card--selected:hover,
.address-card--selected:focus-visible {
  border-color: #111;
  box-shadow: 4px 4px 0 #111;
}

.address-card:focus-visible {
  outline: 3px solid #54b3ea;
  outline-offset: 3px;
}

.address-card__title {
  font-size: 0.85rem;
  text-transform: uppercase;
}

.address-card__details {
  font-family: Arial, sans-serif;
  font-size: 0.8rem;
  line-height: 1.5;
}

.address-card__details dt,
.address-card__details dd {
  margin: 0;
  font-weight: normal;
  overflow-wrap: anywhere;
}
</style>