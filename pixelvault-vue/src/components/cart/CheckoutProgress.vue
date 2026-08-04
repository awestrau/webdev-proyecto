```vue
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
    <section class="checkout-progress col-12 col-md-10 col-lg-8 mx-auto mb-4 p-3 p-md-4 bg-secondary-subtle"
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
                    'opacity-50 text-body-secondary': currentStep !== step.id,
                    'text-dark': currentStep === step.id,
                }" :aria-current="currentStep === step.id ? 'step' : undefined">
                    <img :src="progressIcon" alt="" width="26" height="26" aria-hidden="true">

                    <span class="small">
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

.min-width-zero {
    min-width: 0;
}

.checkout-step {
    transition: opacity 0.2s ease;
}

</style>
```
