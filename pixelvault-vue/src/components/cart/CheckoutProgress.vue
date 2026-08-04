<script setup>
import progressIcon from '../../assets/icons/progress.svg'
import nextIcon from '../../assets/icons/next.svg'

defineProps({
    currentStep: {
        type: String,
        default: 'cart',
        validator: (value) => ['cart', 'checkout', 'payment'].includes(value),
    },
})

const checkoutSteps = [
    {
        id: 'cart',
        label: 'Carrito',
    },
    {
        id: 'checkout',
        label: 'Checkout',
    },
    {
        id: 'payment',
        label: 'Pago',
    },
]
</script>

<template>
    <section class="checkout-progress nes-container is-rounded col-12 col-md-10 col-lg-8 mx-auto mb-4"
        aria-labelledby="checkout-progress-title">
        <h2 id="checkout-progress-title" class="visually-hidden">
            Progreso del proceso de compra
        </h2>

        <ol class="d-flex align-items-center gap-1 gap-md-2 p-0 m-0 list-unstyled">
            <li v-for="(step, index) in checkoutSteps" :key="step.id"
                class="d-flex align-items-center flex-grow-1 min-width-zero">
                <!-- Paso del proceso -->
                <div class="checkout-step d-flex flex-column flex-md-row align-items-center
                 justify-content-center gap-2 flex-grow-1 text-center text-break" :class="{
                    'checkout-step--active': currentStep === step.id,
                }" :aria-current="currentStep === step.id ? 'step' : undefined">
                    <img :src="progressIcon" alt="" width="26" height="26" aria-hidden="true">

                    <span class="checkout-step__label">
                        {{ step.label }}
                    </span>
                </div>

                <!-- Separador entre pasos -->
                <img v-if="index < checkoutSteps.length - 1" :src="nextIcon" alt="" class="flex-shrink-0 mx-1 mx-md-2"
                    width="18" height="18" aria-hidden="true">
            </li>
        </ol>
    </section>
</template>

<style scoped>
.checkout-progress {
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.checkout-progress.nes-container {
    margin-inline: auto;
}

.min-width-zero {
    min-width: 0;
}

.checkout-step {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 3px solid #111;
    background-color: #fff;
    opacity: 0.45;
    transition:
        opacity 0.2s ease,
        background-color 0.2s ease;
}

.checkout-step--active {
    background-color: #fff1d7;
    opacity: 1;
}

.checkout-step__label {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    line-height: 1.6;
    text-transform: uppercase;
    color: #1a1f1f;
}
</style>
