<script setup>
import { ref, watch } from 'vue'

import removeIcon from '../../assets/icons/remove.svg'
import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
    subtotal: {
        type: Number,
        default: 0,
    },

    discount: {
        type: Number,
        default: 0,
    },

    total: {
        type: Number,
        default: 0,
    },

    appliedCoupon: {
        type: Object,
        default: null,
    },

    couponError: {
        type: String,
        default: '',
    },

    isCartEmpty: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'apply-coupon',
    'remove-coupon',
    'continue-checkout',
])

const promoCode = ref('')

watch(
    () => props.appliedCoupon,
    (coupon) => {
        promoCode.value = coupon?.code ?? ''
    },
)

function submitCoupon() {
    if (props.appliedCoupon || props.isCartEmpty) {
        return
    }

    emit('apply-coupon', promoCode.value.trim())
}
</script>

<template>
    <aside class="order-summary nes-container is-rounded" aria-labelledby="order-summary-title">
        <h2 id="order-summary-title" class="order-summary__title mb-3 pb-3">
            Resumen del pedido
        </h2>

        <!-- Código de promoción -->
        <form class="promo-form" @submit.prevent="submitCoupon">
            <label for="promo-code" class="form-label">
                Código de promoción
            </label>

            <div class="d-flex align-items-stretch gap-2">
                <input id="promo-code" v-model="promoCode" class="form-control nes-input flex-grow-1" type="text"
                    placeholder="Digita aquí..." autocomplete="off" :disabled="Boolean(appliedCoupon) || isCartEmpty"
                    aria-describedby="promo-feedback">

                <button class="promo-apply-button nes-btn is-error" type="submit"
                    :disabled="Boolean(appliedCoupon) || isCartEmpty">
                    Aplicar
                </button>
            </div>

            <p v-if="couponError" id="promo-feedback" class="small text-danger mt-2 mb-0" role="alert">
                {{ couponError }}
            </p>
        </form>

        <!-- Cupón aplicado -->
        <section class="applied-discount mt-3 pb-3" aria-labelledby="applied-discount-title">
            <h3 id="applied-discount-title" class="applied-discount__title mb-2">
                Descuentos aplicados
            </h3>

            <div v-if="appliedCoupon" class="d-flex align-items-center justify-content-between gap-3">
                <div class="coupon-information d-flex flex-wrap gap-2">
                    <span>{{ appliedCoupon.code }}</span>

                    <span v-if="appliedCoupon.type === 'percentage'">
                        -{{ appliedCoupon.value }}%
                    </span>

                    <span v-else>
                        -{{ formatCurrency(discount) }}
                    </span>
                </div>

                <button class="remove-coupon-button d-inline-flex align-items-center
                 justify-content-center" type="button"
                    :aria-label="`Eliminar código ${appliedCoupon.code}`" @click="emit('remove-coupon')">
                    <img :src="removeIcon" alt="" width="24" height="24" aria-hidden="true">
                </button>
            </div>

            <p v-else class="small text-body-secondary mb-0">
                No hay códigos aplicados.
            </p>
        </section>

        <!-- Totales -->
        <dl class="order-totals d-flex flex-column gap-3 my-3">
            <div class="d-flex justify-content-between gap-3">
                <dt>Subtotal</dt>
                <dd class="mb-0">
                    {{ formatCurrency(subtotal) }}
                </dd>
            </div>

            <div class="d-flex justify-content-between gap-3">
                <dt>Descuento</dt>
                <dd class="mb-0">
                    {{ discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(discount) }}
                </dd>
            </div>

            <div class="order-total d-flex justify-content-between gap-3">
                <dt>Total</dt>
                <dd class="mb-0">
                    {{ formatCurrency(total) }}
                </dd>
            </div>
        </dl>

        <!-- Continuar -->
        <button class="checkout-button nes-btn is-primary w-100" type="button" :disabled="isCartEmpty"
            @click="emit('continue-checkout')">
            Continuar a checkout
        </button>
    </aside>
</template>

<style scoped>
.order-summary {
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.order-summary__title,
.applied-discount {
    border-bottom: 3px solid #111;
}

.order-summary__title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.75rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.form-label {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    line-height: 1.6;
    text-transform: uppercase;
    color: #1a1f1f;
}

.applied-discount__title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    line-height: 1.6;
    text-transform: uppercase;
    color: #1a1f1f;
}

.promo-apply-button {
    margin: 0;
    padding: 0 1rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    text-transform: uppercase;
    white-space: nowrap;
}

.coupon-information {
    padding: 0.4rem 0.55rem;
    border: 3px solid #111;
    background-color: #fff1d7;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5rem;
    color: #151515;
}

.remove-coupon-button {
    width: 40px;
    height: 40px;
    padding: 0;
    border: 3px solid #111;
    background-color: #fff;
    cursor: pointer;
}

.remove-coupon-button:hover,
.remove-coupon-button:focus-visible {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 2px;
}

.order-totals {
    font-size: 0.7rem;
}

.order-totals dt,
.order-totals dd {
    font-weight: normal;
}

.order-total {
    font-size: 0.8rem;
}

.order-total dt,
.order-total dd {
    font-family: 'Press Start 2P', cursive;
    font-weight: bold;
}

.checkout-button {
    margin: 0;
    padding: 0.9rem 1rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.6;
    text-transform: uppercase;
}

/* Paleta del proyecto sobre los botones nes.css */
.order-summary .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.order-summary .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.order-summary .nes-btn.is-primary:hover:not(:disabled),
.order-summary .nes-btn.is-primary:focus-visible:not(:disabled) {
    background-color: #feb914;
    color: #111;
}

.order-summary .nes-btn.is-primary:hover:not(:disabled)::after,
.order-summary .nes-btn.is-primary:focus-visible:not(:disabled)::after {
    box-shadow: inset -6px -6px #e5a800;
}

.order-summary .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.order-summary .nes-btn.is-error {
    background-color: #e45b61;
    color: #fff;
}

.order-summary .nes-btn.is-error::after {
    box-shadow: inset -4px -4px #8c2022;
}

.order-summary .nes-btn.is-error:hover:not(:disabled),
.order-summary .nes-btn.is-error:focus-visible:not(:disabled) {
    background-color: #feb914;
    color: #111;
}

.order-summary .nes-btn.is-error:hover:not(:disabled)::after,
.order-summary .nes-btn.is-error:focus-visible:not(:disabled)::after {
    box-shadow: inset -6px -6px #e5a800;
}

.order-summary .nes-btn.is-error:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #8c2022;
}

.order-summary .nes-btn:disabled,
.order-summary .nes-btn.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.checkout-button:focus-visible,
.promo-apply-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>
