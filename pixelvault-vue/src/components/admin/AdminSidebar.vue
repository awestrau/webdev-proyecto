<script setup>
import productsIcon from '../../assets/icons/products.svg'
import userIcon from '../../assets/icons/user.svg'
import cartIcon from '../../assets/icons/cart.svg'
import progressIcon from '../../assets/icons/progress.svg'
import savedIcon from '../../assets/icons/saved.svg'
import searchIcon from '../../assets/icons/search.svg'
import menuIcon from '../../assets/icons/menu.svg'
import removeIcon from '../../assets/icons/remove.svg'

const navigationItems = [
  {
    id: 'products',
    label: 'Productos',
    icon: productsIcon,
    active: true,
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: userIcon,
    disabled: true,
  },
  {
    id: 'orders',
    label: 'Órdenes',
    icon: cartIcon,
    disabled: true,
  },
  {
    id: 'discounts',
    label: 'Descuentos',
    icon: savedIcon,
    disabled: true,
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: searchIcon,
    disabled: true,
  },
]

const secondaryItems = [
  {
    id: 'settings',
    label: 'Configuraciones',
    icon: menuIcon,
  },
  {
    id: 'logout',
    label: 'Cerrar sesión',
    icon: removeIcon,
  },
]
</script>

<template>
  <aside class="col-12 col-lg-auto">
    <nav
      class="admin-navigation d-flex flex-row flex-lg-column
             gap-2 overflow-x-auto bg-secondary-subtle p-3 h-100"
      aria-label="Opciones del portal administrativo"
    >
      <button
        v-for="item in navigationItems"
        :key="item.id"
        class="admin-navigation__button btn btn-info
               d-inline-flex align-items-center gap-2 flex-shrink-0
               px-3 py-3 text-start small"
        :class="{
          active: item.active,
          'border border-3 border-primary': item.active,
        }"
        type="button"
        :disabled="item.disabled"
        :aria-pressed="item.active ? 'true' : 'false'"
      >
        <img
          :src="item.icon"
          alt=""
          width="24"
          height="24"
          aria-hidden="true"
        >

        <span>{{ item.label }}</span>
      </button>

      <div
        class="vr d-lg-none flex-shrink-0 bg-dark opacity-100"
        aria-hidden="true"
      />

      <hr
        class="d-none d-lg-block my-2 border-3
               border-dark opacity-100"
        aria-hidden="true"
      >

      <button
        v-for="item in secondaryItems"
        :key="item.id"
        class="admin-navigation__button btn btn-info
               d-inline-flex align-items-center gap-2 flex-shrink-0
               px-3 py-3 text-start small"
        type="button"
        disabled
      >
        <img
          :src="item.icon"
          alt=""
          width="24"
          height="24"
          aria-hidden="true"
        >

        <span>{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.admin-navigation {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.admin-navigation__button {
  min-width: 160px;
  border-radius: 0;
  color: #111;
  font-family: inherit;
  font-size: 0.62rem;
  line-height: 1.5;
}

.admin-navigation__button:not(:disabled):hover,
.admin-navigation__button:not(:disabled):focus-visible {
  background-color: #feb914;
  outline: 3px solid #111;
  outline-offset: 2px;
}

.admin-navigation__button:disabled {
  opacity: 0.5;
}

@media (min-width: 992px) {
  .admin-navigation {
    width: 220px;
  }
}
</style>
