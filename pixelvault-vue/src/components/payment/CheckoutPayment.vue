<script setup>
import { computed, onBeforeUnmount, ref, watch, } from 'vue'
import Modal from 'bootstrap/js/dist/modal'
import PaymentMethodList from './PaymentMethodList.vue'
import PaymentMethodForm from './PaymentMethodForm.vue'
import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps({
    paymentMethods: {
        type: Array, required: true,
    },
    selectedPaymentMethodId: {
        type: [Number, String],
        default: null,
    },
    productCount: {
        type: Number,
        default: 0,
    },
    productsTotal: {
        type: Number,
        default: 0,
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    orderTotal: {
        type: Number,
        default: 0,
    },
    shippingLabel: {
        type: String,
        default: '',
    },
})

const emit = defineEmits([
    'select-payment-method',
    'add-payment-method',
    'back-checkout',
    'order-completed',
])

const paymentStatusModalElement = ref(null)
const paymentStatus = ref('idle')
const paymentError = ref('')
const orderNumber = ref('')

let paymentStatusModal = null
let processingTimer = null

const selectedPaymentMethod = computed(() => {
    return props.paymentMethods.find((paymentMethod) => {
        return paymentMethod.id === props.selectedPaymentMethodId
    }) ?? null
})

const isProcessing = computed(() => {
    return paymentStatus.value === 'processing'
})

watch(selectedPaymentMethod, (paymentMethod) => {
    if (paymentMethod) { paymentError.value = '' }
})

function generateOrderNumber() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    return `PV-${new Date().getFullYear()}-${randomNumber}`
}

function completeOrder() {
    if (!selectedPaymentMethod.value) {
        paymentError.value = 'Selecciona una tarjeta antes de completar la orden.'
        return
    }

    paymentError.value = ''
    paymentStatus.value = 'processing'
    orderNumber.value = ''

    paymentStatusModal = Modal.getOrCreateInstance(
        paymentStatusModalElement.value,
        {
            backdrop: 'static',
            keyboard: false,
        },
    )

    paymentStatusModal.show()

    processingTimer = window.setTimeout(() => {
        orderNumber.value = generateOrderNumber()
        paymentStatus.value = 'success'
    }, 5000)
}
function finishOrder() {
    const completedOrder = {
        orderNumber: orderNumber.value,
        paymentMethodId: selectedPaymentMethod.value?.id,
    }

    const modalElement = paymentStatusModalElement.value

    if (!modalElement || !paymentStatusModal) {
        emit('order-completed', completedOrder)
        return
    }

    modalElement.addEventListener('hidden.bs.modal', () => {
        emit('order-completed', completedOrder)
    },
        {
            once: true
        },
    )
    paymentStatusModal.hide()
} 

onBeforeUnmount(() => {
    if (processingTimer) {
        window.clearTimeout(processingTimer)
    }
    paymentStatusModal?.dispose()
})
</script>

<template>
    <section aria-label="Selección del método de pago">
        <div class="row g-3 align-items-start"> <!-- Tarjetas -->
            <div class="col-12 col-lg-8">
                <div class="payment-panel bg-secondary-subtle p-3 p-md-4">
                    <h1 class="fs-2 text-uppercase mb-5"> Métodos de pago </h1>
                    <PaymentMethodList :payment-methods="paymentMethods"
                        :selected-payment-method-id="selectedPaymentMethodId"
                        @select-payment-method=" emit('select-payment-method', $event)" />
                    <PaymentMethodForm @save-payment-method="emit('add-payment-method', $event)" /> <button
                        class="btn btn-secondary mt-5" type="button" @click="emit('back-checkout')"> Volver a
                        direcciones </button>
                </div>
            </div> <!-- Resumen -->
            <div class="col-12 col-lg-4">
                <aside class="payment-summary bg-secondary-subtle p-3 p-md-4" aria-labelledby="payment-summary-title">
                    <h2 id="payment-summary-title" class="payment-summary__title mb-4"> Resumen del pedido </h2>
                    <ul class="ps-4 mb-4 small">
                        <li class="mb-2"> {{ productCount }} {{ productCount === 1 ? 'producto' : 'productos' }} </li>
                        <li> {{ shippingLabel || 'Envío sin seleccionar' }} </li>
                    </ul>
                    <p v-if="selectedPaymentMethod" class="selected-card-message small mb-4" aria-live="polite"> Pago
                        con {{ selectedPaymentMethod.brand }} que termina en {{ selectedPaymentMethod.last4 }}. </p>
                    <hr class="payment-divider my-4">
                    <dl class="d-flex flex-column gap-3 mb-4">
                        <div class="d-flex justify-content-between gap-3">
                            <dt>Productos</dt>
                            <dd class="mb-0"> {{ formatCurrency(productsTotal) }} </dd>
                        </div>
                        <div class="d-flex justify-content-between gap-3">
                            <dt>Envío</dt>
                            <dd class="mb-0"> +{{ formatCurrency(shippingCost) }} </dd>
                        </div>
                        <div class="payment-summary__total d-flex justify-content-between gap-3">
                            <dt>Total</dt>
                            <dd class="mb-0"> {{ formatCurrency(orderTotal) }} </dd>
                        </div>
                    </dl> <button class="complete-order-button btn w-100 py-3" type="button" :disabled="isProcessing"
                        @click="completeOrder"> Completar orden </button>
                    <p v-if="paymentError" class="small text-danger mt-3 mb-0" role="alert"> {{ paymentError }} </p>
                </aside>
            </div>
        </div> <!-- Modal de procesamiento y confirmación -->
        <div id="payment-status-modal" ref="paymentStatusModalElement" class="modal fade" tabindex="-1"
            aria-labelledby="payment-status-title" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content payment-status-modal">
                    <div class="modal-body p-4 p-md-5 text-center" aria-live="polite"> <template
                            v-if="paymentStatus === 'processing'">
                            <div class="spinner-border mb-4" role="status" aria-label="Procesando pago"></div>
                            <h2 id="payment-status-title" class="fs-5 mb-3"> Procesando pago </h2>
                            <p class="small mb-0"> Estamos simulando la autorización del método de pago. </p>
                        </template>
                        <template v-else-if="paymentStatus === 'success'">
                            <h2 id="payment-status-title" class="fs-4 mb-3"> ¡Gracias por tu compra! </h2>
                            <p class="small mb-2"> La orden se completó correctamente. </p>
                            <p class="mb-4"> Número de orden: <strong>{{ orderNumber }}</strong> </p> <button
                                class="return-home-button btn" type="button" @click="finishOrder"> Volver al inicio
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.payment-panel,
.payment-summary {
    color: #151515;
}

.payment-panel {
    min-height: 550px;
}

.payment-divider {
    border: 0;
    border-top: 5px solid #111;
    opacity: 1;
}

.payment-summary__title {
    font-size: 0.9rem;
}

.selected-card-message {
    line-height: 1.6;
}

.payment-summary dt,
.payment-summary dd {
    font-size: 0.8rem;
    font-weight: normal;
}

.payment-summary__total dt,
.payment-summary__total dd {
    font-size: 0.95rem;
    font-weight: bold;
}

.complete-order-button,
.return-home-button {
    border: 3px solid #111;
    background-color: #54b3ea;
    box-shadow: 4px 4px 0 #111;
    color: #111;
    font-family: inherit;
    text-transform: uppercase;
}

.complete-order-button {
    font-size: 0.7rem;
}

.complete-order-button:hover:not(:disabled),
.complete-order-button:focus-visible:not(:disabled),
.return-home-button:hover,
.return-home-button:focus-visible {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 3px;
}

.complete-order-button:disabled {
    opacity: 0.5;
    cursor: wait;
}

.payment-status-modal {
    border: 4px solid #111;
    border-radius: 0;
    box-shadow: 6px 6px 0 #111;
}

@media (min-width: 992px) {
    .payment-summary {
        position: sticky;
        top: 8rem;
    }
}
</style>
