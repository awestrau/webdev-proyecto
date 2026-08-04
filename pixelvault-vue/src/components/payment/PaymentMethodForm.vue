<script setup>
import { reactive, ref } from 'vue'
import Modal from 'bootstrap/js/dist/modal'
const emit = defineEmits(['save-payment-method'])

const modalElement = ref(null)
const formElement = ref(null)
const cardNumberInput = ref(null)

const minimumExpiryMonth = new Date().toISOString().slice(0, 7)

const formData = reactive({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    securityCode: '',
})

function getCardDigits() {
    return formData.cardNumber.replace(/\D/g, '')
}

function detectCardBrand(cardNumber) {
    if (/^4/.test(cardNumber)) {
        return 'Visa'
    }
    if (/^5[1-5]/.test(cardNumber)) {
        return 'Mastercard'
    }
    return 'Tarjeta'
}
function updateCardNumber(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 19)
    formData.cardNumber = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    validateCardNumber()
}

function validateCardNumber() {
    const digits = getCardDigits()
    const valid = digits.length >= 13 && digits.length <= 19
    cardNumberInput.value?.setCustomValidity(valid ? '' : 'El número debe contener entre 13 y 19 dígitos.',)
    return valid
}

function formatExpiry(expiryMonth) {
    const [year, month] = expiryMonth.split('-')
    return `${month}/${year}`
}
function resetForm() {
    Object.assign(formData, { cardholderName: '', cardNumber: '', expiryMonth: '', securityCode: '', })
    cardNumberInput.value?.setCustomValidity('')
    formElement.value?.classList.remove('was-validated')
}
function savePaymentMethod() {
    validateCardNumber()
    if (!formElement.value?.checkValidity()) {
        formElement.value?.classList.add('was-validated')
        return
    }
    const cardDigits = getCardDigits() /* * No se envían ni se almacenan el número completo ni el CVV. */
    emit('save-payment-method', { brand: detectCardBrand(cardDigits), last4: cardDigits.slice(-4), cardholderName: formData.cardholderName.trim(), expiry: formatExpiry(formData.expiryMonth), })
    Modal.getOrCreateInstance(modalElement.value).hide()
    resetForm()
} 
</script>


<template>
    <div id="payment-method-form-modal" ref="modalElement" class="modal fade" tabindex="-1"
        aria-labelledby="payment-method-form-title" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content payment-form-modal">
                <div class="modal-header">
                    <h2 id="payment-method-form-title" class="modal-title fs-5"> Agregar método de pago </h2> <button
                        class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Cerrar"
                        @click="resetForm" />
                </div>
                <form ref="formElement" novalidate @submit.prevent="savePaymentMethod">
                    <div class="modal-body">
                        <div class="alert alert-info small" role="note"> Esta es una simulación. Utiliza únicamente
                            datos ficticios. </div>
                        <div class="row g-3">
                            <div class="col-12"> <label for="cardholder-name" class="form-label"> Nombre del titular
                                </label> <input id="cardholder-name" v-model.trim="formData.cardholderName"
                                    class="form-control nes-input" type="text" autocomplete="off" required>
                                <div class="invalid-feedback"> Ingresa el nombre del titular. </div>
                            </div>
                            <div class="col-12"> <label for="card-number" class="form-label"> Número de tarjeta </label>
                                <input id="card-number" ref="cardNumberInput" :value="formData.cardNumber"
                                    class="form-control nes-input" type="text" inputmode="numeric" maxlength="23"
                                    autocomplete="off" placeholder="0000 0000 0000 0000" required
                                    @input="updateCardNumber">
                                <div class="invalid-feedback"> Ingresa un número de tarjeta ficticio válido. </div>
                            </div>
                            <div class="col-12 col-md-6"> <label for="card-expiry" class="form-label"> Fecha de
                                    vencimiento </label> <input id="card-expiry" v-model="formData.expiryMonth"
                                    class="form-control nes-input" type="month" :min="minimumExpiryMonth" required>
                                <div class="invalid-feedback"> Selecciona una fecha de vencimiento. </div>
                            </div>
                            <div class="col-12 col-md-6"> <label for="card-security-code" class="form-label"> Código de
                                    seguridad </label> <input id="card-security-code" v-model="formData.securityCode"
                                    class="form-control nes-input" type="password" inputmode="numeric"
                                    pattern="[0-9]{3,4}" minlength="3" maxlength="4" autocomplete="off" required>
                                <div class="invalid-feedback"> Ingresa un código ficticio de 3 o 4 dígitos. </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer"> <button class="btn btn-secondary" type="button" data-bs-dismiss="modal"
                            @click="resetForm"> Cancelar </button> <button class="save-payment-method-button btn"
                            type="submit"> Guardar tarjeta </button> </div>
                </form>
            </div>
        </div>
    </div>
</template>


<style scoped>
.payment-form-modal {
    border: 4px solid #111;
    border-radius: 0;
    box-shadow: 6px 6px 0 #111;
}

.form-label,
.modal-title,
.modal-footer button {
    font-family: inherit;
}

.form-label {
    font-size: 0.7rem;
}

.save-payment-method-button {
    border: 3px solid #111;
    background-color: #54b3ea;
    box-shadow: 3px 3px 0 #111;
    color: #111;
}

.save-payment-method-button:hover,
.save-payment-method-button:focus-visible {
    background-color: #feb914;
    outline: 3px solid #111;
    outline-offset: 2px;
}
</style>
