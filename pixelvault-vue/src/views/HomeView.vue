<script setup>
import { computed, ref } from 'vue'

import products from '../data/products.json'
import { formatCurrency } from '../utils/formatCurrency'

const failedImages = ref(new Set())

/*
 * Destacados reales del catálogo, en orden retro de mayor a menor impacto:
 * 11 - Super Nintendo Entertainment System, 12 - Super Mario World, 10 - PlayStation 2 Slim.
 * Las imágenes de Unsplash se usan solo como ilustración.
 */
const featuredProductIds = [11, 12, 10]

const featuredImageByProductId = {
  11: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop',
  12: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=250&fit=crop',
  10: 'https://images.unsplash.com/photo-1555864326-5cf22ef123cf?w=400&h=250&fit=crop',
}

const featuredProducts = computed(() => {
  return featuredProductIds
    .map((productId) => {
      const product = products.find((item) => {
        return Number(item.id) === productId
      })

      if (!product) {
        return null
      }

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        badgeClass: getBadgeClass(product.category),
        image: featuredImageByProductId[productId],
        alt: product.name,
      }
    })
    .filter(Boolean)
})

function getBadgeClass(category) {
  const normalizedCategory = String(category ?? '')

  if (normalizedCategory.startsWith('Juego')) {
    return 'badge-game'
  }

  return 'badge-console'
}

function handleImageError(productId) {
  failedImages.value = new Set([
    ...failedImages.value,
    productId,
  ])
}

const categories = [
  {
    id: 'consolas',
    title: 'Consolas',
    description: 'NES, SNES, Sega Genesis, Game Boy y más.',
    iconClass: 'trophy',
  },
  {
    id: 'videojuegos',
    title: 'Videojuegos',
    description: 'Cartuchos, discos y títulos clásicos originales.',
    iconClass: 'star',
  },
  {
    id: 'accesorios',
    title: 'Accesorios',
    description: 'Controles, cables, adaptadores y repuestos.',
    iconClass: 'coin',
  },
]
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero" id="hero" aria-labelledby="hero-title">
      <div class="container text-center">
        <h1 id="hero-title" class="hero-title">PixelVault</h1>

        <p class="hero-subtitle">Revive los clásicos. Colecciona nostalgia.</p>

        <p class="hero-desc">
          Tu tienda de confianza para videojuegos y consolas retro. Descubrí títulos
          legendarios y piezas de colección que marcaron generaciones.
        </p>

        <div class="hero-buttons">
          <router-link :to="{ name: 'products' }" class="nes-btn is-warning">Explorar Catálogo</router-link>

          <router-link to="/registro" class="nes-btn">Crear Cuenta</router-link>
        </div>
      </div>
    </section>

    <!-- Productos destacados -->
    <section class="container mt-5" id="productos-destacados" aria-labelledby="productos-title">
      <h2 id="productos-title" class="section-title text-center">Productos Destacados</h2>

      <div class="row g-4 mt-3">
        <div v-for="product in featuredProducts" :key="product.id" class="col-md-4">
          <article class="nes-container is-rounded product-card">
            <div class="product-img-wrapper">
              <img v-if="!failedImages.has(product.id)" :src="product.image" :alt="product.alt" class="product-img"
                @error="handleImageError(product.id)">

              <span v-else class="product-img-placeholder d-flex align-items-center justify-content-center text-center p-3"
                role="img" :aria-label="product.alt">
                Imagen no disponible
              </span>
            </div>

            <div class="product-body">
              <span class="nes-badge product-badge" :class="product.badgeClass">
                <span class="is-dark">{{ product.category }}</span>
              </span>

              <h3 class="product-name">{{ product.name }}</h3>

              <p class="product-price">{{ formatCurrency(product.price) }}</p>

              <router-link :to="{ name: 'product-detail', params: { id: String(product.id) } }"
                class="nes-btn is-primary w-100" :aria-label="`Ver ${product.name}`">Ver Producto</router-link>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Categorías -->
    <section class="container mt-5" id="categorias" aria-labelledby="categorias-title">
      <h2 id="categorias-title" class="section-title text-center">Categorías</h2>

      <div class="row g-4 mt-3">
        <div v-for="category in categories" :key="category.id" class="col-md-4">
          <div class="nes-container is-rounded category-card">
            <div class="category-icon" aria-hidden="true">
              <i class="nes-icon" :class="[category.iconClass, 'is-large']"></i>
            </div>

            <h3 class="category-name">{{ category.title }}</h3>

            <p class="category-desc">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Promo -->
    <section class="container mt-5 mb-5" id="promo" aria-labelledby="promo-title">
      <div class="nes-container is-rounded promo-card text-center">
        <h2 id="promo-title" class="promo-title">¿Listo para jugar?</h2>

        <p class="promo-desc">Registrate y obtené envío gratis en tu primera compra.</p>

        <router-link to="/registro" class="nes-btn is-warning">Registrarme Ahora</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  --home-blue: #54b3ea;
  --home-blue-dark: #3a8ec7;
  --home-highlight: #feb914;
  --home-highlight-dark: #e5a800;
  --home-text-dark: #1a1f1f;
  --home-text-main: #4a4d4f;
  --home-border: #111;
  --home-line: #3f444b;
}

/* Hero */

.hero {
  padding: 4rem 1rem;
  background-color: #fff;
  border-bottom: 3px solid var(--home-line);
}

.hero-title {
  margin-bottom: 1.25rem;
  color: var(--home-text-dark);
  font-family: 'Press Start 2P', cursive;
  font-size: 1.5rem;
  line-height: 1.6;
  text-transform: uppercase;
}

.hero-subtitle {
  margin-bottom: 1.5rem;
  color: #a16207;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.9rem;
  line-height: 1.8;
  text-transform: uppercase;
}

.hero-desc {
  max-width: 600px;
  margin: 0 auto 2rem;
  color: var(--home-text-main);
  font-size: 1rem;
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.hero-buttons .nes-btn {
  padding: 0.9rem 1.5rem;
  font-size: 0.7rem;
}

/* Títulos de sección */

.section-title {
  margin: 0;
  color: var(--home-text-dark);
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  line-height: 1.8;
  text-transform: uppercase;
}

/* Botones nes.css con la paleta del proyecto */

.nes-btn.is-warning {
  background-color: var(--home-highlight);
  color: var(--home-text-dark);
}

.nes-btn.is-warning::after {
  box-shadow: inset -4px -4px var(--home-highlight-dark);
}

.nes-btn.is-warning:hover {
  background-color: var(--home-highlight-dark);
}

.nes-btn.is-warning:hover::after {
  box-shadow: inset -6px -6px #c98a00;
}

.nes-btn.is-warning:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #c98a00;
}

.nes-btn.is-primary {
  background-color: var(--home-blue);
  color: var(--home-text-dark);
}

.nes-btn.is-primary::after {
  box-shadow: inset -4px -4px var(--home-blue-dark);
}

.nes-btn.is-primary:hover {
  background-color: var(--home-blue-dark);
}

.nes-btn.is-primary:hover::after {
  box-shadow: inset -6px -6px #2c6fa0;
}

.nes-btn.is-primary:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #2c6fa0;
}

.nes-btn.is-primary:focus,
.nes-btn.is-warning:focus {
  box-shadow: 0 0 0 6px rgba(17, 17, 17, 0.2);
}

/* Productos */

.product-card {
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-shadow: 4px 4px 0 var(--home-border);
  transition: transform 150ms ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-img-wrapper {
  height: 200px;
  overflow: hidden;
  border-bottom: 3px solid var(--home-border);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-img-placeholder {
  width: 100%;
  height: 100%;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.6rem;
  line-height: 1.8;
  color: #1a1f1f;
  background-color: #fff1d7;
}

.product-body {
  padding: 1.25rem;
}

.product-badge {
  margin: 0 0 1rem;
  font-size: 0.65rem;
}

.product-badge .is-dark {
  color: var(--home-text-dark);
}

.product-badge.badge-console .is-dark {
  background-color: var(--home-blue);
  box-shadow:
    0 0.5em var(--home-blue),
    0 -0.5em var(--home-blue),
    0.5em 0 var(--home-blue),
    -0.5em 0 var(--home-blue);
}

.product-badge.badge-game .is-dark {
  background-color: var(--home-highlight);
  box-shadow:
    0 0.5em var(--home-highlight),
    0 -0.5em var(--home-highlight),
    0.5em 0 var(--home-highlight),
    -0.5em 0 var(--home-highlight);
}

.product-name {
  margin: 1rem 0;
  color: var(--home-text-dark);
  font-family: 'Press Start 2P', cursive;
  font-size: 0.65rem;
  line-height: 1.8;
}

.product-price {
  margin-bottom: 1.25rem;
  color: var(--home-text-dark);
  font-family: 'Press Start 2P', cursive;
  font-size: 0.75rem;
}

.product-body .nes-btn {
  padding: 0.85rem 1rem;
  font-size: 0.6rem;
}

/* Categorías */

.category-card {
  height: 100%;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 4px 4px 0 var(--home-border);
  transition: transform 150ms ease;
}

.category-card:hover {
  transform: translateY(-4px);
}

.category-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.25rem;
  overflow: hidden;
}

.category-icon .nes-icon {
  display: block;
  margin: 0;
}

.category-name {
  margin-bottom: 0.75rem;
  color: var(--home-text-dark);
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.category-desc {
  margin: 0;
  color: var(--home-text-main);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Promo */

.promo-card {
  padding: 3rem 1.5rem;
  box-shadow: 4px 4px 0 var(--home-border);
}

.promo-title {
  margin-bottom: 0.75rem;
  color: var(--home-text-dark);
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  line-height: 1.8;
  text-transform: uppercase;
}

.promo-desc {
  margin-bottom: 1.5rem;
  color: var(--home-text-main);
  font-size: 1rem;
}

.promo-card .nes-btn {
  padding: 0.9rem 1.5rem;
  font-size: 0.7rem;
}

/* Foco visible */

.hero-buttons .nes-btn:focus-visible,
.product-body .nes-btn:focus-visible,
.promo-card .nes-btn:focus-visible {
  outline: 3px solid var(--home-border);
  outline-offset: 3px;
}

/* Pantallas pequeñas en adelante */

@media (min-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
  }

  .section-title {
    font-size: 1.15rem;
  }

  .product-name {
    font-size: 0.7rem;
  }
}

/* Escritorio */

@media (min-width: 992px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}
</style>
