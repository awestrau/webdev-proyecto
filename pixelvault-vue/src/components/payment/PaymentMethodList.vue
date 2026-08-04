<script setup>
import { computed } from 'vue'
import PaymentMethodCard from './PaymentMethodCard.vue'
const props = defineProps({
    paymentMethods: {
        type: Array,
        required: true,
    },
    selectedPaymentMethodId: {
        type: [Number, String],
        default: null,
    },
})
const emit = defineEmits(['select-payment-method'])
const paymentMethodCountLabel = computed(() => {
    const count = props.paymentMethods.length
    const word = count === 1 ? 'tarjeta guardada' : 'tarjetas guardadas'
    return `${count} ${word}`
}) 
</script>

<template>
    <section aria-labelledby="payment-methods-title">
        <div class="d-flex flex-wrap align-items-baseline gap-2 mb-4">
            <h2 id="payment-methods-title" class="payment-methods-title m-0"> Mis tarjetas de crédito y débito </h2> <span
                class="visually-hidden"> {{ paymentMethodCountLabel }} </span>
        </div>
        <div v-if="paymentMethods.length === 0" class="payment-methods-empty nes-container mb-4" role="status"> No tienes
            tarjetas guardadas. Agrega una tarjeta para completar la orden. </div>
        <div v-else class="row g-3 mb-4">
            <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id" class="col-12 col-md-6">
                <PaymentMethodCard :payment-method="paymentMethod"
                    :selected="selectedPaymentMethodId === paymentMethod.id"
                    @select="emit('select-payment-method', $event)" />
            </div>
        </div> <button class="add-payment-method-button nes-btn is-primary" type="button"
            data-bs-toggle="modal" data-bs-target="#payment-method-form-modal"> + Agregar nueva tarjeta de
            crédito/débito </button>
    </section>
</template>

<style scoped>
.payment-methods-title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.payment-methods-empty {
    border: 3px solid #111;
    background-color: #fff1d7;
    color: #151515;
    font-size: 0.8rem;
    line-height: 1.6;
}

.add-payment-method-button {
    margin: 0;
    padding: 0.75rem 1.25rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
    line-height: 1.6;
    text-transform: uppercase;
}

/* Paleta del proyecto sobre el botón nes.css */
.add-payment-method-button.nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.add-payment-method-button.nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.add-payment-method-button.nes-btn.is-primary:hover,
.add-payment-method-button.nes-btn.is-primary:focus-visible {
    background-color: #feb914;
    color: #111;
}

.add-payment-method-button.nes-btn.is-primary:hover::after,
.add-payment-method-button.nes-btn.is-primary:focus-visible::after {
    box-shadow: inset -6px -6px #e5a800;
}

.add-payment-method-button.nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.add-payment-method-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>
