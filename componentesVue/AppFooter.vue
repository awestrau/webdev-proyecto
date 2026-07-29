<script setup>
const footerSections = [
    {
        id: 'store',
        title: 'Tienda',
        columnClass: 'col-6 col-md-4',
        links: [
            { label: 'Videojuegos', href: '#' },
            { label: 'Consolas', href: '#' },
            { label: 'Retro', href: '#' },
            { label: 'Ofertas', href: '#' },
        ],
    },
    {
        id: 'help',
        title: 'Ayuda',
        columnClass: 'col-6 col-md-4',
        links: [
            { label: 'Preguntas frecuentes', href: '#' },
            { label: 'Envíos', href: '#' },
            { label: 'Devoluciones', href: '#' },
            { label: 'Soporte', href: '#' },
        ],
    },
    {
        id: 'company',
        title: 'PixelVault',
        columnClass: 'col-12 col-md-4 text-center text-md-start',
        links: [
            { label: 'Sobre nosotros', href: '#' },
            { label: 'Contacto', href: '#' },
            { label: 'Privacidad', href: '#' },
            { label: 'Términos', href: '#' },
        ],
    },
]

const socialLinks = [
    {
        id: 'instagram',
        label: 'PixelVault en Instagram',
        href: '#',
        iconClass: 'instagram',
    },
    {
        id: 'twitter',
        label: 'PixelVault en Twitter',
        href: '#',
        iconClass: 'twitter',
    },
    {
        id: 'twitch',
        label: 'PixelVault en Twitch',
        href: '#',
        iconClass: 'twitch',
    },
]

const currentYear = new Date().getFullYear()
</script>

<template>
    <footer class="site-footer">
        <div class="container footer-container py-5">
            <!-- Marca -->
            <div class="footer-brand-area text-center mb-4">
                <span class="footer-brand">
                    PIXELVAULT
                </span>

                <p class="footer-tagline">
                    Videojuegos, consolas y clásicos retro para seguir jugando generaciones.
                </p>
            </div>

            <!-- Enlaces secundarios -->
            <nav class="footer-links row g-3 mb-4" aria-label="Navegación secundaria">
                <section v-for="section in footerSections" :key="section.id" :class="section.columnClass"
                    :aria-labelledby="`footer-${section.id}-title`">
                    <div class="footer-column h-100">
                        <h2 :id="`footer-${section.id}-title`">
                            {{ section.title }}
                        </h2>

                        <ul class="d-flex flex-column gap-2">
                            <li v-for="link in section.links" :key="link.label">
                                <a :href="link.href">
                                    {{ link.label }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </section>
            </nav>

            <!-- Contacto y redes sociales -->
            <div class="footer-contact d-flex flex-column flex-md-row align-items-center
               justify-content-md-between gap-3 text-center text-md-start mb-4">
                <address class="d-flex flex-column gap-2 mb-0">
                    <span>San José, Costa Rica</span>

                    <a href="mailto:soporte@pixelvault.com">
                        soporte@pixelvault.com
                    </a>
                </address>

                <nav class="footer-social d-flex flex-wrap justify-content-center gap-3" aria-label="Redes sociales">
                    <a v-for="social in socialLinks" :key="social.id" :href="social.href" :aria-label="social.label">
                        <i :class="[
                            'nes-icon',
                            social.iconClass,
                            'is-medium',
                        ]" aria-hidden="true" />
                    </a>
                </nav>
            </div>

            <!-- Copyright -->
            <div class="footer-bottom text-center pt-3">
                <small>
                    &copy; {{ currentYear }} PixelVault. Todos los derechos reservados.
                </small>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.site-footer {
    --footer-background: #54b3ea;
    --footer-text: #1a1f1f;
    --footer-highlight: #feb914;
    --footer-border: #111;

    margin-top: 3rem;
    background-color: var(--footer-background);
    border-top: 3px solid #3f444b;
}

.footer-brand {
    display: inline-block;
    color: var(--footer-text);
    font-size: 1.75rem;
    line-height: 1.4;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.footer-tagline {
    max-width: 680px;
    margin: 1rem auto 0;
    color: var(--footer-text);
    font-size: 0.7rem;
    line-height: 1.8;
}

/* Columnas de enlaces */

.footer-column {
    padding: 1rem;
    border: 3px solid var(--footer-border);
    background-color: #fff;
    box-shadow: 4px 4px 0 var(--footer-border);
}

.footer-column h2 {
    margin-bottom: 1rem;
    color: var(--footer-text);
    font-size: 0.85rem;
}

.footer-column ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.footer-column a,
.footer-contact a,
.footer-social a {
    color: var(--footer-text);
    text-decoration: none;
}

.footer-column a {
    display: inline-block;
    font-size: 0.65rem;
    line-height: 1.6;
}

/* Estados interactivos */

.footer-column a:hover,
.footer-column a:focus-visible,
.footer-contact a:hover,
.footer-contact a:focus-visible {
    color: var(--footer-border);
    background-color: var(--footer-highlight);
    outline: 3px solid var(--footer-border);
    outline-offset: 3px;
}

/* Información de contacto */

.footer-contact address {
    color: var(--footer-text);
    font-size: 0.65rem;
    font-style: normal;
    line-height: 1.6;
}

/* Redes sociales */

.footer-social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    overflow: hidden;
    border: 3px solid var(--footer-border);
    background-color: #fff;
    box-shadow: 3px 3px 0 var(--footer-border);
}

.footer-social a:hover,
.footer-social a:focus-visible {
    background-color: var(--footer-highlight);
    outline: 3px solid var(--footer-border);
    outline-offset: 3px;
}

.footer-social .nes-icon {
    flex: 0 0 auto;
    margin: 0;
    transform-origin: center;
}

/* Copyright */

.footer-bottom {
    border-top: 3px solid var(--footer-border);
}

.footer-bottom small {
    color: var(--footer-text);
    font-size: 0.6rem;
    line-height: 1.6;
}

/* Tablet y escritorio */

@media (min-width: 768px) {
    .footer-brand {
        font-size: 2.5rem;
    }
}
</style>
