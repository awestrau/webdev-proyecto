<script setup>
import productsIcon from '../../assets/icons/products.svg'
import categoriesIcon from '../../assets/icons/categories.svg'
import platformsIcon from '../../assets/icons/platforms.svg'

defineProps({
  productCount: {
    type: Number,
    default: 0,
  },
  categoryCount: {
    type: Number,
    default: 0,
  },
  platformCount: {
    type: Number,
    default: 0,
  },
})

const metrics = [
  {
    key: 'products',
    label: 'Productos registrados',
    valueProp: 'productCount',
    icon: productsIcon,
  },
  {
    key: 'categories',
    label: 'Categorías registradas',
    valueProp: 'categoryCount',
    icon: categoriesIcon,
  },
  {
    key: 'platforms',
    label: 'Plataformas registradas',
    valueProp: 'platformCount',
    icon: platformsIcon,
  },
]
</script>

<template>
  <section
    class="row g-3 mb-4"
    aria-label="Métricas del inventario"
  >
    <div
      v-for="metric in metrics"
      :key="metric.key"
      class="col-12 col-md-4"
    >
      <article
        class="admin-metric d-flex align-items-center
               gap-3 h-100 p-3 bg-warning-subtle"
      >
        <span
          class="admin-metric__icon d-inline-flex
                 align-items-center justify-content-center
                 flex-shrink-0 bg-white"
          aria-hidden="true"
        >
          <img
            :src="metric.icon"
            alt=""
            width="40"
            height="40"
          >
        </span>

        <div>
          <p class="admin-metric__value fs-3 mb-2">
            {{ $props[metric.valueProp] }}
          </p>

          <h2 class="admin-metric__label mb-0">
            {{ metric.label }}
          </h2>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.admin-metric {
  min-height: 135px;
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.admin-metric__icon {
  width: 70px;
  height: 70px;
  border: 3px solid #111;
}

.admin-metric__value {
  line-height: 1;
}

.admin-metric__label {
  font-size: 0.62rem;
  line-height: 1.6;
}
</style>
