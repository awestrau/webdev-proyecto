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
            <h2 id="payment-methods-title" class="m-0 fs-4 text-uppercase"> Mis tarjetas de crédito y débito </h2> <span
                class="visually-hidden"> {{ paymentMethodCountLabel }} </span>
        </div>
        <div v-if="paymentMethods.length === 0" class="alert alert-warning mb-4" role="status"> No tienes tarjetas
            guardadas. Agrega una tarjeta para completar la orden. </div>
        <div v-else class="row g-3 mb-4">
            <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id" class="col-12 col-md-6">
                <PaymentMethodCard :payment-method="paymentMethod"
                    :selected="selectedPaymentMethodId === paymentMethod.id"
                    @select="emit('select-payment-method', $event)" />
            </div>
        </div> <button class="add-payment-method-button btn btn-link p-0 border-0 text-decoration-none" type="button"
            data-bs-toggle="modal" data-bs-target="#payment-method-form-modal"> + Agregar nueva tarjeta de
            crédito/débito </button>
    </section>
</template>


<style scoped>
.add-payment-method-button {
    color: #0000dd;
    font-family: inherit;
    font-size: 0.75rem;
    text-transform: uppercase;
}

.add-payment-method-button:hover,
.add-payment-method-button:focus-visible {
    color: #111;
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>
