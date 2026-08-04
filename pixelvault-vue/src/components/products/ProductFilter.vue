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
    <section class="product-filter bg-secondary-subtle p-3 p-md-4 mb-4" aria-labelledby="product-filter-title">
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

                <select id="product-category-filter" v-model="selectedCategory" class="form-select">
                    <option value="">
                        Todas las categorías
                    </option>

                    <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                    </option>
                </select>
            </div>

            <!-- Plataforma -->
            <div class="col-12 col-md-5">
                <label for="product-platform-filter" class="form-label">
                    Plataforma
                </label>

                <select id="product-platform-filter" v-model="selectedPlatform" class="form-select">
                    <option value="">
                        Todas las plataformas
                    </option>

                    <option v-for="platform in platforms" :key="platform" :value="platform">
                        {{ platform }}
                    </option>
                </select>
            </div>

            <!-- Limpiar -->
            <div class="col-12 col-md-2">
                <button class="clear-filter-button btn w-100" type="button" :disabled="!hasActiveFilters"
                    @click="clearFilters">
                    Limpiar filtros
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.product-filter {
    border: 3px solid #111;
    box-shadow: 4px 4px 0 #111;
}

.form-label {
    font-size: 0.72rem;
}

.form-select {
    min-height: 52px;
    border: 3px solid #111;
    border-radius: 0;
    background-color: #fff;
    color: #151515;
    font-family: inherit;
    font-size: 0.68rem;
}

.form-select:focus {
    border-color: #111;
    box-shadow: 0 0 0 0.25rem rgb(84 179 234 / 35%);
}

.clear-filter-button {
    min-height: 52px;
    border: 3px solid #111;
    border-radius: 0;
    background-color: #54b3ea;
    box-shadow: 3px 3px 0 #111;
    color: #111;
    font-family: inherit;
    font-size: 0.62rem;
}

.clear-filter-button:hover:not(:disabled),
.clear-filter-button:focus-visible:not(:disabled) {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 2px;
}

.clear-filter-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}
</style>