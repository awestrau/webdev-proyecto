<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

function handleSearch(searchTerm) {
  // Temporal hasta implementar la búsqueda de productos.
  console.log('Buscar producto:', searchTerm)
}

function handleMenuToggle() {
  // Temporal hasta implementar el menú lateral.
  console.log('Abrir menú de navegación')
}
</script>

<template>
  <link rel="stylesheet" href="./node_modules/nes.css/css/nes.min.css">

  <div class="min-vh-100 d-flex flex-column">
    <AppHeader @search="handleSearch" @toggle-menu="handleMenuToggle" />

    <main id="main-content" class="flex-grow-1">
      <!-- Aquí se mostrarán las páginas del proyecto. -->
    </main>

    <AppFooter />
  </div>
</template>



<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
</style>