import {
  readonly,
  ref,
} from 'vue'

import {
  deleteOrder as deleteOrderRequest,
  getOrders,
  updateOrderStatus as updateOrderStatusRequest,
} from '../services/api'

import { withId } from '../utils/normalizeId'

// --- Estado a nivel de módulo (patrón de useProducts) ---
const orders = ref([])
const loadingOrders = ref(false)
const ordersError = ref('')
const ordersLoaded = ref(false)

let loadingRequest = null

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'No fue posible completar la operación con órdenes.'
}

function replaceOrder(updatedOrder) {
  const index = orders.value.findIndex((order) => {
    return String(order.id) === String(updatedOrder.id)
  })

  if (index === -1) {
    orders.value.unshift(updatedOrder)
    return
  }

  orders.value[index] = updatedOrder
}

async function loadOrders({ force = false } = {}) {
  if (ordersLoaded.value && !force) {
    return orders.value
  }

  if (loadingRequest && !force) {
    return loadingRequest
  }

  loadingOrders.value = true
  ordersError.value = ''

  loadingRequest = getOrders()
    .then((data) => {
      orders.value = (data.orders || []).map(withId)
      ordersLoaded.value = true
      return orders.value
    })
    .catch((error) => {
      ordersError.value = getErrorMessage(error)
      throw error
    })
    .finally(() => {
      loadingOrders.value = false
      loadingRequest = null
    })

  return loadingRequest
}

async function updateOrderStatus(orderId, status) {
  ordersError.value = ''

  try {
    const data = await updateOrderStatusRequest(orderId, status)

    if (data.order) {
      replaceOrder(withId(data.order))
    }

    return data.order
  } catch (error) {
    ordersError.value = getErrorMessage(error)
    throw error
  }
}

async function cancelOrder(orderId) {
  ordersError.value = ''

  try {
    const data = await deleteOrderRequest(orderId)

    if (data.order) {
      replaceOrder(withId(data.order))
    }

    return data.order
  } catch (error) {
    ordersError.value = getErrorMessage(error)
    throw error
  }
}

function clearOrdersError() {
  ordersError.value = ''
}

export function useOrders() {
  return {
    orders: readonly(orders),
    loadingOrders: readonly(loadingOrders),
    ordersError: readonly(ordersError),
    ordersLoaded: readonly(ordersLoaded),
    loadOrders,
    updateOrderStatus,
    cancelOrder,
    clearOrdersError,
  }
}
