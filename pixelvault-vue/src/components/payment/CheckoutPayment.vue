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
    /*
     * Estado de la orden informado por MiCarritoView:
     * - `orderReady`: la orden ya quedó registrada (habilita la descarga).
     * - `orderError`: mensaje de error para mostrar DENTRO del modal (el
     *   banner del padre queda tapado por el backdrop del modal).
     * - `downloading`: hay una descarga de comprobante en curso.
     */
    orderReady: {
        type: Boolean,
        default: false,
    },
    orderError: {
        type: String,
        default: '',
    },
    downloading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'select-payment-method',
    'add-payment-method',
    'back-checkout',
    'order-completed',
    'download-invoice',
    'go-home',
])

const paymentStatusModalElement = ref(null)
const paymentStatus = ref('idle')
const paymentError = ref('')
const orderNumber = ref('')
const completedOrder = ref(null)

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

    /*
     * La orden se emite en cuanto el modal pasa a "success", no cuando el
     * usuario hace clic en un botón: así MiCarritoView registra la orden de
     * inmediato aunque el usuario cierre la pestaña justo después de pagar.
     */
    processingTimer = window.setTimeout(() => {
        orderNumber.value = generateOrderNumber()
        paymentStatus.value = 'success'
        completedOrder.value = {
            orderNumber: orderNumber.value,
            paymentMethodId: selectedPaymentMethod.value?.id,
        }
        emit('order-completed', completedOrder.value)
    }, 5000)
}
/*
 * La orden ya fue emitida al mostrar el modal de éxito: estos botones solo
 * informan al padre de la decisión del usuario (descargar el comprobante o
 * volver al inicio); la descarga y la navegación las ejecuta MiCarritoView.
 */
function downloadInvoice() {
    emit('download-invoice')
}

function goHome() {
    emit('go-home')
}

/*
 * Solo se ofrece cuando el registro de la orden falló (orderReady false):
 * re-emite la misma orden para que MiCarritoView reintente crearla.
 */
function retryOrder() {
    if (!completedOrder.value) {
        return
    }

    emit('order-completed', completedOrder.value)
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
                <div class="payment-panel nes-container is-rounded">
                    <h1 class="payment-title mb-5"> Métodos de pago </h1>
                    <PaymentMethodList :payment-methods="paymentMethods"
                        :selected-payment-method-id="selectedPaymentMethodId"
                        @select-payment-method=" emit('select-payment-method', $event)" />
                    <PaymentMethodForm @save-payment-method="emit('add-payment-method', $event)" /> <button
                        class="nes-btn back-checkout-button mt-5" type="button" @click="emit('back-checkout')"> Volver a
                        direcciones </button>
                </div>
            </div> <!-- Resumen -->
            <div class="col-12 col-lg-4">
                <aside class="payment-summary nes-container is-rounded" aria-labelledby="payment-summary-title">
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
                    </dl> <button class="complete-order-button nes-btn is-primary w-100" type="button"
                        :disabled="isProcessing" @click="completeOrder"> Completar orden </button>
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
                            <span class="pixel-spinner mb-4" role="status" aria-label="Procesando pago"></span>
                            <h2 id="payment-status-title" class="payment-status-title mb-3"> Procesando pago </h2>
                            <p class="small mb-0"> Estamos simulando la autorización del método de pago. </p>
                        </template>
                        <template v-else-if="paymentStatus === 'success'">
                            <h2 id="payment-status-title" class="payment-status-title mb-3"> ¡Gracias por tu compra! </h2>
                            <p class="small mb-2"> La orden se completó correctamente. </p>
                            <p class="payment-status-order mb-4"> Número de orden: <strong>{{ orderNumber }}</strong> </p>
                            <div v-if="orderError" class="payment-status-error mb-3" role="alert" aria-live="polite">
                                <p class="small mb-2">
                                    {{ orderError }}
                                </p>
                                <button v-if="!orderReady" class="retry-order-button nes-btn is-warning" type="button"
                                    @click="retryOrder">
                                    Reintentar
                                </button>
                            </div>
                            <div class="payment-status-actions d-flex flex-column gap-2">
                                <button class="download-invoice-button nes-btn is-primary" type="button"
                                    :disabled="!orderReady || downloading" @click="downloadInvoice">
                                    {{ downloading ? 'Descargando…' : 'Descargar comprobante' }}
                                </button>
                                <button class="return-home-button nes-btn is-success" type="button" @click="goHome">
                                    Volver al inicio
                                </button>
                            </div>
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
    background-color: #fff;
    color: #151515;
    box-shadow: 4px 4px 0 #111;
}

.payment-panel {
    min-height: 550px;
}

.payment-title,
.payment-summary__title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.9rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.payment-divider {
    border: 0;
    border-top: 5px solid #111;
    opacity: 1;
}

.selected-card-message {
    line-height: 1.6;
}

.payment-summary dt,
.payment-summary dd {
    font-size: 0.7rem;
    font-weight: normal;
}

.payment-summary__total dt,
.payment-summary__total dd {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.65rem;
    font-weight: bold;
}

.back-checkout-button {
    margin: 0;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
    text-transform: uppercase;
}

.back-checkout-button:hover,
.back-checkout-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}

.complete-order-button,
.return-home-button {
    margin: 0;
    padding: 0.9rem 1rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.6;
    text-transform: uppercase;
}

/* Paleta del proyecto sobre los botones nes.css */
.payment-summary .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.payment-summary .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.payment-summary .nes-btn.is-primary:hover:not(:disabled),
.payment-summary .nes-btn.is-primary:focus-visible:not(:disabled) {
    background-color: #feb914;
    color: #111;
}

.payment-summary .nes-btn.is-primary:hover:not(:disabled)::after,
.payment-summary .nes-btn.is-primary:focus-visible:not(:disabled)::after {
    box-shadow: inset -6px -6px #e5a800;
}

.payment-summary .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.payment-summary .nes-btn.is-primary:disabled {
    opacity: 0.5;
    cursor: wait;
}

.complete-order-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}

.payment-status-modal .nes-btn.is-primary {
    background-color: #54b3ea;
    color: #111;
}

.payment-status-modal .nes-btn.is-primary::after {
    box-shadow: inset -4px -4px #3a8ec7;
}

.payment-status-modal .nes-btn.is-primary:hover,
.payment-status-modal .nes-btn.is-primary:focus-visible {
    background-color: #feb914;
    color: #111;
}

.payment-status-modal .nes-btn.is-primary:hover::after,
.payment-status-modal .nes-btn.is-primary:focus-visible::after {
    box-shadow: inset -6px -6px #e5a800;
}

.payment-status-modal .nes-btn.is-primary:active:not(.is-disabled)::after {
    box-shadow: inset 4px 4px #3a8ec7;
}

.return-home-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}

.payment-status-actions {
    margin-top: 1.25rem;
}

.download-invoice-button,
.retry-order-button {
    margin: 0;
    padding: 0.9rem 1rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.6rem;
    line-height: 1.6;
    text-transform: uppercase;
}

.download-invoice-button:focus-visible,
.retry-order-button:focus-visible {
    outline: 3px solid #111;
    outline-offset: 3px;
}

.payment-status-modal .nes-btn:disabled {
    opacity: 0.5;
    cursor: wait;
}

.payment-status-error {
    padding: 0.75rem 1rem;
    border: 3px solid #111;
    background-color: #fff;
    box-shadow: 4px 4px 0 #111;
    color: #ce372b;
    text-align: left;
}

.payment-status-error .small {
    line-height: 1.6;
    overflow-wrap: anywhere;
}

.payment-status-modal {
    border: 4px solid #111;
    border-radius: 0;
    box-shadow: 6px 6px 0 #111;
}

.payment-status-modal .modal-body {
    background-color: #fff;
}

.payment-status-title {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    line-height: 1.8;
    text-transform: uppercase;
    color: #1a1f1f;
}

.payment-status-order {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.55rem;
    line-height: 1.8;
}

.pixel-spinner {
    display: inline-block;
    width: 2.25rem;
    height: 2.25rem;
    border: 3px solid #111;
    background-color: #feb914;
    box-shadow: 4px 4px 0 #111;
    animation: pixel-spin 0.9s steps(4) infinite;
}

@keyframes pixel-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@media (min-width: 992px) {
    .payment-summary {
        position: sticky;
        top: 8rem;
    }
}
</style>
