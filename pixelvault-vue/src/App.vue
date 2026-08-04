<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

/*function handleSearch(searchTerm) {
  // Temporal hasta implementar la búsqueda de productos.
  console.log('Buscar producto:', searchTerm)
}*/

function handleMenuToggle() {
  // Temporal hasta implementar el menú lateral.
  console.log('Abrir menú de navegación')
}
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">
    <AppHeader
      @toggle-menu="handleMenuToggle"
    />

    <RouterView />

    <AppFooter />
  </div>
</template>
