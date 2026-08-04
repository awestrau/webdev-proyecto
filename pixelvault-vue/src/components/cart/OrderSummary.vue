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
    <aside class="order-summary bg-secondary-subtle p-3 p-md-4" aria-labelledby="order-summary-title">
        <h2 id="order-summary-title" class="order-summary__title mb-3 pb-3">
            Resumen del pedido
        </h2>

        <!-- Código de promoción -->
        <form class="promo-form" @submit.prevent="submitCoupon">
            <label for="promo-code" class="form-label small">
                Código de promoción
            </label>

            <div class="input-group">
                <input id="promo-code" v-model="promoCode" class="form-control nes-input" type="text"
                    placeholder="Digita aquí..." autocomplete="off" :disabled="Boolean(appliedCoupon) || isCartEmpty"
                    aria-describedby="promo-feedback">

                <button class="btn promo-apply-button" type="submit" :disabled="Boolean(appliedCoupon) || isCartEmpty">
                    Aplicar
                </button>
            </div>

            <p v-if="couponError" id="promo-feedback" class="small text-danger mt-2 mb-0" role="alert">
                {{ couponError }}
            </p>
        </form>

        <!-- Cupón aplicado -->
        <section class="applied-discount mt-3 pb-3" aria-labelledby="applied-discount-title">
            <h3 id="applied-discount-title" class="small mb-2">
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

                <button class="remove-coupon-button btn d-inline-flex align-items-center
                 justify-content-center p-1 border-0 bg-warning-subtle" type="button"
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
        <button class="checkout-button btn w-100 py-3" type="button" :disabled="isCartEmpty"
            @click="emit('continue-checkout')">
            Continuar a checkout
        </button>
    </aside>
</template>

<style scoped>
.order-summary {
    color: #151515;
}

.order-summary__title,
.applied-discount {
    border-bottom: 3px solid #111;
}

.order-summary__title {
    font-size: 0.9rem;
    text-transform: uppercase;
}

.promo-apply-button {
    border: 3px solid #111;
    background-color: #e45b61;
    color: #fff;
    font-family: inherit;
}

.promo-apply-button:hover:not(:disabled),
.promo-apply-button:focus-visible:not(:disabled) {
    background-color: #feb914;
    color: #111;
    outline: 3px solid #111;
    outline-offset: 2px;
}

.promo-apply-button:disabled,
.checkout-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.coupon-information {
    padding: 0.4rem 0.55rem;
    background-color: #fff1d7;
    font-size: 0.65rem;
}

.remove-coupon-button:hover,
.remove-coupon-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 2px;
}

.order-totals {
    font-size: 0.75rem;
}

.order-totals dt,
.order-totals dd {
    font-weight: normal;
}

.order-total {
    font-size: 0.9rem;
}

.order-total dt,
.order-total dd {
    font-weight: bold;
}

.checkout-button {
    border: 3px solid #111;
    background-color: #feb914;
    box-shadow: 4px 4px 0 #111;
    color: #111;
    font-family: inherit;
    font-size: 0.7rem;
    text-transform: uppercase;
}

.checkout-button:hover:not(:disabled),
.checkout-button:focus-visible:not(:disabled) {
    background-color: #fff;
    outline: 3px solid #111;
    outline-offset: 3px;
}
</style>
