<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import CheckoutProgress from '../components/cart/CheckoutProgress.vue'
import CartList from '../components/cart/CartList.vue'
import OrderSummary from '../components/cart/OrderSummary.vue'
import CheckoutAddress from '../components/checkout/CheckoutAddress.vue'
import CheckoutPayment from '../components/payment/CheckoutPayment.vue'

import products from '../data/products.json'
import promotionCodes from '../data/promotionCodes.json'
import addressesData from '../data/addresses.json'
import shippingOptionsData from '../data/shippingOptions.json'
import paymentMethodsData from '../data/paymentMethods.json'
import { formatCurrency } from '../utils/formatCurrency'

import { useCart } from '../composables/useCart'

const router = useRouter()

const currentStep = ref('cart')
const appliedCoupon = ref(null)
const couponError = ref('')
const selectedProduct = ref(null)

/*
 * Catálogo simulado.
 * En una entrega posterior estos productos vendrán de la base de datos.
 */

const {
  cartItems,
  subtotal,
  totalUnits: totalProductUnits,
  increaseQuantity,
  decreaseQuantity,
  removeProduct: removeCartProduct,
  clearCart: clearStoredCart,
} = useCart(products)

const addresses = ref(
  addressesData.map((address) => ({
    ...address,
  })),
)

const shippingOptions = shippingOptionsData.map((option) => ({
  ...option,
}))

const paymentMethods = ref(
  paymentMethodsData.map((paymentMethod) => ({
    ...paymentMethod,
  })),
)

/*
 * Códigos disponibles para la simulación.
 *
 * HOLIDAY aplica un descuento fijo de ₡7.500.
 * PLAYER20 aplica un 20% de descuento.
 * RETRO10 aplica un 10% de descuento.
 */

const discountAmount = computed(() => {
    if (!appliedCoupon.value) {
        return 0
    }

    let discount = 0

    if (appliedCoupon.value.type === 'percentage') {
        discount = subtotal.value * (appliedCoupon.value.value / 100)
    } else {
        discount = appliedCoupon.value.value
    }

    /*
     * Evita que un descuento fijo sea mayor que el subtotal.
     */
    return roundCurrency(Math.min(discount, subtotal.value))
})

const orderTotal = computed(() => {
    return roundCurrency(
        Math.max(subtotal.value - discountAmount.value, 0),
    )
})

const isCartEmpty = computed(() => {
    return cartItems.value.length === 0
})

function roundCurrency(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100
}

function removeProduct(productId) {
  removeCartProduct(productId)

  if (selectedProduct.value?.id === productId) {
    selectedProduct.value = null
  }
}

function clearCart() {
  clearStoredCart()
  selectedProduct.value = null
}

function applyCoupon(code) {
  couponError.value = ''

  if (appliedCoupon.value) {
    couponError.value = 'Ya existe un código aplicado a esta orden.'
    return
  }

  if (!code) {
    couponError.value = 'Ingresa un código de promoción.'
    return
  }

  const normalizedCode = code.trim().toUpperCase()

  const promotion = promotionCodes.find((item) => {
    return item.code === normalizedCode
  })

  if (!promotion) {
    couponError.value = 'El código ingresado no es válido.'
    return
  }

  appliedCoupon.value = {
    ...promotion,
  }
}

function removeCoupon() {
    appliedCoupon.value = null
    couponError.value = ''
}

function continueToCheckout() {
    if (isCartEmpty.value) {
        return
    }

    selectedProduct.value = null
    currentStep.value = 'checkout'
}

function showProductDetails(productId) {
    selectedProduct.value = products.find((product) => {
        return product.id === productId
    }) ?? null
}

function closeProductDetails() {
    selectedProduct.value = null
}

/*
 * Si se eliminan todos los productos, el código aplicado también se elimina.
 */
watch(subtotal, (newSubtotal) => {
    if (newSubtotal === 0) {
        removeCoupon()
    }
})

//Seccion checkout
const selectedAddressId = ref(addresses.value[0]?.id ?? null)
const selectedShippingId = ref('express')

const selectedShipping = computed(() => {
    return shippingOptions.find((option) => {
        return option.id === selectedShippingId.value
    }) ?? null
})

const shippingCost = computed(() => {
    return selectedShipping.value?.cost ?? 0
})

const checkoutTotal = computed(() => {
    return roundCurrency(orderTotal.value + shippingCost.value)
})

function selectAddress(addressId) {
    const exists = addresses.value.some((address) => {
        return address.id === addressId
    })

    if (exists) {
        selectedAddressId.value = addressId
    }
}

function addAddress(addressData) {
    const highestId = addresses.value.reduce((highest, address) => {
        return Math.max(highest, Number(address.id))
    }, 0)

    const newAddress = {
        id: highestId + 1,
        label: `Dirección ${addresses.value.length + 1}`,
        ...addressData,
    }

    addresses.value.push(newAddress)

    /*
     * La dirección recién agregada queda seleccionada automáticamente.
     */
    selectedAddressId.value = newAddress.id
}

function selectShipping(shippingId) {
    const exists = shippingOptions.some((option) => {
        return option.id === shippingId
    })

    if (exists) {
        selectedShippingId.value = shippingId
    }
}

function continueToPayment() {
    if (!selectedAddressId.value || !selectedShippingId.value) {
        return
    }

    currentStep.value = 'payment'
}

//SECCION PAGO
const selectedPaymentMethodId = ref(null)
//Funciones
function selectPaymentMethod(paymentMethodId) {
    const exists = paymentMethods.value.some((paymentMethod) => {
        return paymentMethod.id === paymentMethodId
    })

    if (exists) {
        selectedPaymentMethodId.value = paymentMethodId
    }
}

function addPaymentMethod(paymentMethodData) {
    const highestId = paymentMethods.value.reduce(
        (highest, paymentMethod) => {
            return Math.max(highest, Number(paymentMethod.id))
        },
        0,
    )

    const newPaymentMethod = {
        id: highestId + 1,
        ...paymentMethodData,
    }

    paymentMethods.value.push(newPaymentMethod)

    /*
     * La tarjeta recién agregada queda seleccionada.
     */
    selectedPaymentMethodId.value = newPaymentMethod.id
}

function handleOrderCompleted(completedOrder) {
    clearCart()
    removeCoupon()

    selectedPaymentMethodId.value = null
    selectedAddressId.value = null
    currentStep.value = 'cart'

    /*
     * Reemplaza la pantalla de pago por el landing page.
     */
    router.replace({ name: 'home' })
}
</script>

<template>

    <main class="cart-page flex-grow-1">
        <div class="container cart-page__container">
            <div class="row">
                <CheckoutProgress :current-step="currentStep" />
            </div>

            <!-- Etapa 1: Carrito -->
            <section v-if="currentStep === 'cart'" aria-label="Contenido del carrito">
                <div class="row g-3 align-items-start">
                    <div class="col-12 col-lg-8">
                        <CartList :items="cartItems" @increase-quantity="increaseQuantity"
                            @decrease-quantity="decreaseQuantity" @remove-product="removeProduct"
                            @clear-cart="clearCart" @view-details="showProductDetails" />
                    </div>

                    <div class="col-12 col-lg-4">
                        <OrderSummary :subtotal="subtotal" :discount="discountAmount" :total="orderTotal"
                            :applied-coupon="appliedCoupon" :coupon-error="couponError" :is-cart-empty="isCartEmpty"
                            @apply-coupon="applyCoupon" @remove-coupon="removeCoupon"
                            @continue-checkout="continueToCheckout" />
                    </div>
                </div>

                <!-- Detalle de producto temporal -->
                <section v-if="selectedProduct" class="product-detail-panel bg-warning-subtle p-3 p-md-4 mt-4"
                    aria-labelledby="product-detail-title">
                    <div class="d-flex flex-wrap align-items-start
                   justify-content-between gap-3 mb-3">
                        <div>
                            <h2 id="product-detail-title" class="fs-4 mb-2">
                                {{ selectedProduct.name }}
                            </h2>

                            <p class="small mb-0">
                                Vista de detalle del producto
                            </p>
                        </div>

                        <button class="btn btn-danger" type="button" @click="closeProductDetails">
                            Cerrar
                        </button>
                    </div>

                    <div class="row g-3">
                        <div class="col-12 col-sm-4">
                            <div class="ratio ratio-1x1 bg-secondary" aria-hidden="true"></div>
                        </div>

                        <div class="col-12 col-sm-8">
                            <dl class="row small mb-0">
                                <dt class="col-5">Plataforma:</dt>
                                <dd class="col-7">
                                    {{ selectedProduct.platform }}
                                </dd>

                                <dt class="col-5">Categoría:</dt>
                                <dd class="col-7">
                                    {{ selectedProduct.category }}
                                </dd>

                                <dt class="col-5">Precio:</dt>
                                <dd class="col-7">
                                    {{ formatCurrency(selectedProduct.price) }}
                                </dd>

                                <dt class="col-12 mt-3">Descripción:</dt>
                                <dd class="col-12">
                                    {{ selectedProduct.description }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </section>

                <!-- Publicidad -->
                <aside class="ad-banner d-flex align-items-center justify-content-center
                 mx-auto mt-5 p-4 text-center bg-secondary-subtle" aria-label="Espacio publicitario">
                    <h2 class="m-0">
                        Publicidad
                    </h2>
                </aside>
            </section>

            <!-- Etapa 2 Checkout -->
            <CheckoutAddress v-else-if="currentStep === 'checkout'" :addresses="addresses"
                :selected-address-id="selectedAddressId" :shipping-options="shippingOptions"
                :selected-shipping-id="selectedShippingId" :product-count="totalProductUnits"
                :products-total="orderTotal" :shipping-cost="shippingCost" :order-total="checkoutTotal"
                @select-address="selectAddress" @add-address="addAddress" @select-shipping="selectShipping"
                @continue-payment="continueToPayment" @back-cart="currentStep = 'cart'" />


            <!-- Etapa 3 Pago -->
            <CheckoutPayment v-else-if="currentStep === 'payment'" :payment-methods="paymentMethods"
                :selected-payment-method-id="selectedPaymentMethodId" :product-count="totalProductUnits"
                :products-total="orderTotal" :shipping-cost="shippingCost" :order-total="checkoutTotal"
                :shipping-label="selectedShipping?.label ?? ''" @select-payment-method="selectPaymentMethod"
                @add-payment-method="addPaymentMethod" @back-checkout="currentStep = 'checkout'"
                @order-completed="handleOrderCompleted" />
        </div>
    </main>
</template>

<style scoped>
.cart-page {
    padding: 1.25rem 0.75rem 3rem;
    background-color: #fff;
    color: #151515;
}

.cart-page__container {
    max-width: 1180px;
}

.ad-banner {
    width: 100%;
    max-width: 760px;
    min-height: 220px;
}

.ad-banner h2 {
    font-size: clamp(2rem, 8vw, 4rem);
}

.product-detail-panel {
    border: 3px solid #111;
    box-shadow: 4px 4px 0 #111;
}

.checkout-placeholder {
    max-width: 850px;
    min-height: 320px;
    margin-inline: auto;
    border: 3px solid #111;
}

.checkout-next-button {
    border: 3px solid #111;
    background-color: #feb914;
    box-shadow: 3px 3px 0 #111;
    color: #111;
    font-family: inherit;
}
</style>
