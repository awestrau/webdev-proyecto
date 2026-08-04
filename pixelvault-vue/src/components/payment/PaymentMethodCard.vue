<script setup>
defineProps({
    paymentMethod: {
        type: Object,
        required: true,
    },

    selected: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits(['select']) 
</script>

<template>
    <button class="payment-method-card w-100 h-100 p-3 p-md-4 text-start"
        :class="{ 'payment-method-card--selected': selected }" type="button" :aria-pressed="selected"
        :aria-label="`Seleccionar ${paymentMethod.brand} terminada en ${paymentMethod.last4}`"
        @click="emit('select', paymentMethod.id)">
        <h3 class="payment-method-card__title mb-2"> {{ paymentMethod.brand }} termina en {{ paymentMethod.last4 }}
        </h3>
        <p class="mb-2"> {{ paymentMethod.cardholderName }} </p>
        <p class="mb-0"> {{ paymentMethod.expiry }} </p>
    </button>
</template>

<style scoped>
.payment-method-card {
    min-height: 165px;
    border: 3px solid #111;
    background-color: #fff;
    color: #151515;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        border-color 150ms ease,
        transform 150ms ease,
        background-color 150ms ease;
}

.payment-method-card:hover,
.payment-method-card:focus-visible {
    border-color: #54b3ea;
    transform: translateY(-2px);
}

.payment-method-card--selected,
.payment-method-card--selected:hover,
.payment-method-card--selected:focus-visible {
    border-color: #111;
    background-color: #fff1d7;
    box-shadow: 4px 4px 0 #111;
}

.payment-method-card:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}

.payment-method-card__title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.payment-method-card p {
    font-size: 0.7rem;
    line-height: 1.6;
    color: #4a4d4f;
}
</style>
