<script setup>
import { useProductFilters } from '../../composables/useProductFilters'

defineProps({
    categories: {
        type: Array,
        default: () => [],
    },

    platforms: {
        type: Array,
        default: () => [],
    },

    resultCount: {
        type: Number,
        default: 0,
    },
})

const {
    searchText,
    selectedCategory,
    selectedPlatform,
    hasActiveFilters,
    clearFilters,
} = useProductFilters()
</script>

<template>
    <section class="product-filter nes-container is-rounded mb-4" aria-labelledby="product-filter-title">
        <div class="d-flex flex-wrap align-items-center
             justify-content-between gap-3 mb-4">
            <div>
                <h2 id="product-filter-title" class="fs-4 mb-2">
                    Filtrar productos
                </h2>

                <p v-if="searchText" class="small mb-0">
                    Búsqueda:
                    <strong>“{{ searchText }}”</strong>
                </p>
            </div>

            <p class="small mb-0" aria-live="polite">
                Resultados visibles:
                <strong>{{ resultCount }}</strong>
            </p>
        </div>

        <div class="row g-3 align-items-end">
            <!-- Categoría -->
            <div class="col-12 col-md-5">
                <label for="product-category-filter" class="form-label">
                    Categoría
                </label>

                <div class="nes-select">
                    <select id="product-category-filter" v-model="selectedCategory">
                        <option value="">
                            Todas las categorías
                        </option>

                        <option v-for="category in categories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Plataforma -->
            <div class="col-12 col-md-5">
                <label for="product-platform-filter" class="form-label">
                    Plataforma
                </label>

                <div class="nes-select">
                    <select id="product-platform-filter" v-model="selectedPlatform">
                        <option value="">
                            Todas las plataformas
                        </option>

                        <option v-for="platform in platforms" :key="platform" :value="platform">
                            {{ platform }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Limpiar -->
            <div class="col-12 col-md-2">
                <button class="clear-filter-button nes-btn is-primary w-100" type="button"
                    :disabled="!hasActiveFilters" @click="clearFilters">
                    Limpiar filtros
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.product-filter {
    box-shadow: 4px 4px 0 #111;
    background-color: #fff;
    color: #151515;
}

.product-filter h2 {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    line-height: 1.8;
    text-transform: uppercase;
}

.form-label {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    text-transform: uppercase;
}

.nes-select {
    margin: 0;
}

.nes-select select {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.6;
    color: #151515;
    background-color: #fff;
}

.clear-filter-button {
    min-height: 52px;
    margin: 0;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.58rem;
    text-transform: uppercase;
}

/* Paleta del proyecto sobre el botón nes.css */
.product-filter .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.product-filter .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.product-filter .nes-btn.is-primary:hover:not(:disabled),
.product-filter .nes-btn.is-primary:focus-visible:not(:disabled) {
    background-color: #feb914;
    color: #111;
}

.product-filter .nes-btn.is-primary:hover:not(:disabled)::after,
.product-filter .nes-btn.is-primary:focus-visible:not(:disabled)::after {
    box-shadow: inset -6px -6px #e5a800;
}

.product-filter .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.clear-filter-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}

.clear-filter-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}
</style>
