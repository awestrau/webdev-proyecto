<script setup>
//import { ref } from 'vue'

import menuIcon from '../assets/icons/menu.svg'
import searchIcon from '../assets/icons/search.svg'
import savedIcon from '../assets/icons/saved.svg'
import cartIcon from '../assets/icons/cart.svg'
import userIcon from '../assets/icons/user.svg'
import logoImage from '../assets/images/logo.jpg'

/*const emit = defineEmits({
    search: (searchTerm) => typeof searchTerm === 'string',
    'toggle-menu': () => true,
})

const searchText = ref('')*/

const navigationActions = [
    {
        id: 'saved',
        label: 'Guardados',
        ariaLabel: 'Ver productos guardados',
        to: {
            name: 'favorites',
        },
        icon: savedIcon,
    },
    {
        id: 'cart',
        label: 'Carrito',
        ariaLabel: 'Ver carrito',
        to: {
            name: 'cart',
        },
        icon: cartIcon,
    },
    {
        id: 'login',
        label: 'Ingresar',
        ariaLabel: 'Iniciar sesión',
        to: '/login',
        icon: userIcon,
    },
]

/*function submitSearch() {
    const normalizedSearch = searchText.value.trim()

    if (!normalizedSearch) {
        return
    }

    emit('search', normalizedSearch)
}*/
import { computed } from 'vue'
import {
    RouterLink,
    useRouter,
} from 'vue-router'

import { useProductFilters } from '../composables/useProductFilters'

const router = useRouter()

const emit = defineEmits([
    'toggle-menu',
])

const {
    searchText,
    searchError,
    setSearchText,
    clearSearch,
} = useProductFilters()

const searchModel = computed({
    get() {
        return searchText.value
    },

    set(value) {
        setSearchText(value)
    },
})

function submitSearch() {
    router.push({
        name: 'products',
    })
}


</script>

<template>
    <header class="site-header sticky-top">
        <nav class="navbar navbar-expand-lg" aria-label="Navegación principal">
            <div class="container-fluid nav-container d-flex flex-wrap flex-lg-nowrap align-items-center gap-2 p-2">
                <!-- Menú y marca -->
                <div class="nav-brand-area d-flex align-items-center gap-3">
                    <button class="menu-button nes-container d-flex align-items-center justify-content-center"
                        type="button" aria-label="Abrir menú de navegación" @click="emit('toggle-menu')">
                        <img :src="menuIcon" alt="" class="nav-icon" aria-hidden="true">
                    </button>

                    <RouterLink :to="{ name: 'products' }" class="navbar-brand d-flex align-items-center m-0"
                        aria-label="Ir al catálogo de PixelVault">
                        <img :src="logoImage" alt="" class="site-logo" aria-hidden="true">

                        <span class="site-title">
                            PIXELVAULT
                        </span>
                    </RouterLink>
                </div>

                <!-- Buscador -->
                <form id="search-form" class="search-form order-3 order-lg-0 flex-lg-grow-1 mx-lg-auto w-100"
                    role="search" @submit.prevent="submitSearch">
                    <label for="search-product-input" class="visually-hidden">
                        Buscar producto por nombre o categoría
                    </label>

                    <div class="search-input-wrapper nes-field">
                        <input id="search-product-input" v-model="searchModel"
                            class="form-control search-input nes-input" :class="{ 'is-invalid': searchError }"
                            type="search" placeholder="Buscar producto" autocomplete="off" maxlength="60"
                            :aria-invalid="Boolean(searchError)" aria-describedby="product-search-error"
                            @keydown.esc="clearSearch">

                        <button class="search-button" type="submit" aria-label="Buscar producto">
                            <img :src="searchIcon" alt="" class="search-icon" aria-hidden="true">
                        </button>
                    </div>
                    <p v-if="searchError" id="product-search-error" class="search-error text-danger mt-2 mb-0"
                        role="alert">
                        {{ searchError }}
                    </p>
                </form>


                <!-- Acciones -->
                <div class="nav-actions ms-auto ms-lg-0 d-flex align-items-center gap-2 gap-sm-3">
                    <component :is="action.to ? RouterLink : 'a'" v-for="action in navigationActions" :key="action.id"
                        v-bind="action.to
                            ? { to: action.to }
                            : { href: action.href }
                            " class="nav-action-link d-flex flex-column align-items-center"
                        :aria-label="action.ariaLabel">
                        <span class="nav-action-icon-box d-inline-flex align-items-center justify-content-center"
                            aria-hidden="true">
                            <img :src="action.icon" alt="" class="nav-action-icon">
                        </span>

                        <span>{{ action.label }}</span>
                    </component>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>
.site-header {
    --header-background: #54b3ea;
    --header-text: #1a1f1f;
    --header-highlight: #feb914;
    --header-border: #111;

    background-color: var(--header-background);
    border-bottom: 4px solid var(--header-border);
}

.nav-container {
    max-width: 1440px;
    margin-inline: auto;
}


.search-error {
    font-size: 0.52rem;
    line-height: 1.5;
}

.search-input.is-invalid {
    border-color: #dc3545;
    background-image: none;
}


/* Marca y menú */
.menu-button {
    width: 44px;
    height: 44px;
    padding: 0;
    border: 3px solid var(--header-border);
    background-color: #fff;
    box-shadow: 3px 3px 0 var(--header-border);
    cursor: pointer;
}

.nav-icon {
    width: 22px;
    height: 22px;
    image-rendering: pixelated;
}

.site-logo {
    width: 48px;
    height: 48px;
    margin-right: 0.4rem;
    object-fit: contain;
    image-rendering: pixelated;
}

.site-title {
    color: var(--header-text);
    font-size: 0.9rem;
    font-weight: bold;
    letter-spacing: 1px;
    white-space: nowrap;
}

/* Buscador */

.search-input-wrapper {
    position: relative;
    width: 100%;
    transition:
        box-shadow 150ms ease,
        transform 150ms ease;
}

.search-input-wrapper:hover,
.search-input-wrapper:focus-within {
    box-shadow: 0 4px 10px 2px var(--header-highlight);
}

.search-input {
    width: 100%;
    padding-right: 3.25rem;
}

.search-input:focus {
    box-shadow: none;
}

.search-button {
    position: absolute;
    top: 50%;
    right: 0.7rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    transform: translateY(-50%);
}

.search-icon {
    width: 28px;
    height: 28px;
    image-rendering: pixelated;
    transition: transform 150ms ease;
}

.search-button:hover .search-icon,
.search-button:focus-visible .search-icon {
    transform: scale(1.15);
}

.search-button:focus-visible {
    outline: 3px solid var(--header-border);
    outline-offset: 2px;
}

/* Enlaces de navegación */

.nav-action-link {
    color: var(--header-text);
    font-size: 0.5rem;
    font-weight: bold;
    line-height: 1.1;
    text-decoration: none;
}

.nav-action-icon-box {
    width: 44px;
    height: 44px;
    margin-bottom: 0.35rem;
    border: 3px solid var(--header-border);
    background-color: #fff;
    box-shadow: 3px 3px 0 var(--header-border);
}

.nav-action-icon {
    width: 28px;
    height: 28px;
    image-rendering: pixelated;
}

.nav-action-link:hover {
    color: var(--header-text);
}

.nav-action-link:hover .nav-action-icon-box,
.nav-action-link:focus-visible .nav-action-icon-box,
.menu-button:hover,
.menu-button:focus-visible {
    background-color: var(--header-highlight);
    outline: 3px solid var(--header-border);
    outline-offset: 3px;
}

.nav-action-link:focus-visible {
    outline: none;
}

/* Pantallas pequeñas en adelante */
@media (min-width: 576px) {

    .menu-button,
    .nav-action-icon-box {
        width: 52px;
        height: 52px;
    }

    .nav-icon {
        width: 24px;
        height: 24px;
    }

    .site-logo {
        width: 65px;
        height: 65px;
        margin-right: 0.65rem;
    }

    .site-title {
        font-size: 1.4rem;
    }

    .nav-action-link {
        font-size: 0.6rem;
    }

    .nav-action-icon {
        width: 35px;
        height: 35px;
    }

    .search-icon {
        width: 30px;
        height: 30px;
    }
}


/* Escritorio */
@media (min-width: 992px) {
    .search-form {
        max-width: 750px;
    }

    .site-title {
        font-size: 1.2rem;
    }
}
</style>
