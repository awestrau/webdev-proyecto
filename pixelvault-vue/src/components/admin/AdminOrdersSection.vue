<script setup>
import { onMounted } from 'vue'

import { formatCurrency } from '../../utils/formatCurrency'
import { useOrders } from '../../composables/useOrders'

const emit = defineEmits([
  'feedback',
])

const {
  orders,
  loadingOrders,
  ordersError,
  loadOrders,
  updateOrderStatus,
  cancelOrder,
  clearOrdersError,
} = useOrders()

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagada' },
  { value: 'shipped', label: 'Enviada' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'cancelled', label: 'Cancelada' },
]

function statusLabel(status) {
  return ORDER_STATUSES.find((option) => option.value === status)?.label || status
}

function shortId(id) {
  return String(id || '').slice(0, 8)
}

function itemCount(order) {
  if (!Array.isArray(order.items)) {
    return 0
  }

  return order.items.reduce((sum, item) => {
    return sum + Number(item.quantity || 0)
  }, 0)
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('es-CR')
}

async function handleStatusChange(order, event) {
  const status = event.target.value

  if (!status || status === order.status) {
    return
  }

  try {
    const updated = await updateOrderStatus(order.id, status)

    emit('feedback', {
      type: 'success',
      message: `Orden #${shortId(updated.id)} actualizada a "${statusLabel(updated.status)}".`,
    })
  } catch (error) {
    emit('feedback', {
      type: 'danger',
      message: error instanceof Error ? error.message : 'No fue posible actualizar la orden.',
    })
    clearOrdersError()
  }
}

async function handleCancel(order) {
  const confirmed = window.confirm(
    `¿Cancelar la orden #${shortId(order.id)}? Esta acción no se puede deshacer.`,
  )

  if (!confirmed) {
    return
  }

  try {
    const updated = await cancelOrder(order.id)

    emit('feedback', {
      type: 'success',
      message: `Orden #${shortId(updated.id)} cancelada correctamente.`,
    })
  } catch (error) {
    emit('feedback', {
      type: 'danger',
      message: error instanceof Error ? error.message : 'No fue posible cancelar la orden.',
    })
    clearOrdersError()
  }
}

function retryOrders() {
  loadOrders({ force: true }).catch(() => {})
}

onMounted(() => {
  loadOrders().catch(() => {})
})
</script>

<template>
  <section
    class="admin-orders-section bg-white p-3 p-md-4"
    aria-labelledby="admin-orders-title"
  >
    <div class="mb-4">
      <h2
        id="admin-orders-title"
        class="fs-4 mb-2"
      >
        Órdenes
      </h2>

      <p class="small mb-0">
        Revisa el estado de las órdenes, cambia su estado o cancélalas.
      </p>
    </div>

    <div v-if="loadingOrders" class="admin-api-state p-5 text-center" role="status">
      Cargando órdenes desde MongoDB...
    </div>

    <div v-else-if="ordersError" class="alert alert-danger admin-section-alert" role="alert">
      <p class="mb-3">{{ ordersError }}</p>

      <button class="nes-btn is-primary" type="button" @click="retryOrders">
        Reintentar conexión
      </button>
    </div>

    <div
      v-else-if="orders.length === 0"
      class="admin-products-empty bg-warning-subtle
             p-4 p-md-5 text-center"
      role="status"
    >
      <h3 class="fs-5 mb-3">
        No hay órdenes registradas
      </h3>

      <p class="small mb-0">
        Las órdenes aparecerán aquí cuando los clientes realicen compras.
      </p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-bordered align-middle admin-table mb-0">
        <thead>
          <tr>
            <th scope="col">Orden</th>
            <th scope="col">Usuario</th>
            <th scope="col">Items</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
            <th scope="col">Creada</th>
            <th scope="col" class="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>
              <code class="small">#{{ shortId(order.id) }}</code>
            </td>

            <td>
              <code class="small" :title="order.user">
                {{ shortId(order.user) }}
              </code>
            </td>

            <td>{{ itemCount(order) }}</td>

            <td class="admin-table__total">
              {{ formatCurrency(order.total) }}
            </td>

            <td>
              <label class="visually-hidden" :for="'order-status-' + order.id">
                Estado de la orden {{ shortId(order.id) }}
              </label>

              <select
                :id="'order-status-' + order.id"
                class="form-select admin-status-select"
                :value="order.status"
                :disabled="order.status === 'cancelled'"
                @change="handleStatusChange(order, $event)"
              >
                <option v-for="option in ORDER_STATUSES" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </td>

            <td>{{ formatDate(order.createdAt) }}</td>

            <td class="text-end">
              <button
                v-if="order.status !== 'cancelled'"
                class="cancel-order-button btn"
                type="button"
                :aria-label="'Cancelar la orden #' + shortId(order.id)"
                @click="handleCancel(order)"
              >
                Cancelar
              </button>

              <span v-else class="small text-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.admin-orders-section {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.admin-api-state {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  background-color: #fff1d7;
  font-size: 0.68rem;
  line-height: 1.8;
}

.admin-section-alert {
  border: 3px solid #111;
  border-radius: 0;
  box-shadow: 3px 3px 0 #111;
  font-size: 0.68rem;
}

.admin-products-empty {
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
}

.admin-table {
  border: 3px solid #111;
  font-size: 0.66rem;
}

.admin-table th {
  border: 2px solid #111;
  background-color: #54b3ea;
  color: #111;
  font-size: 0.6rem;
  text-transform: uppercase;
  white-space: nowrap;
}

.admin-table td {
  border: 2px solid #111;
}

.admin-table__total {
  font-weight: 700;
  white-space: nowrap;
}

.admin-status-select {
  min-width: 130px;
  border: 2px solid #111;
  border-radius: 0;
  font-family: inherit;
  font-size: 0.62rem;
}

.cancel-order-button {
  min-height: 44px;
  padding: 0.4rem 0.75rem;
  border: 3px solid #111;
  border-radius: 1rem;
  background-color: #e76e55;
  color: #fff;
  font-family: inherit;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.cancel-order-button:hover,
.cancel-order-button:focus-visible {
  background-color: #feb914;
  color: #111;
  outline: 3px solid #111;
  outline-offset: 3px;
}
</style>
