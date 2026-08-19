const mongoose = require('mongoose')

const Order = require('../models/Order.model')

const orderFields = new Set([
  'user',
  'items',
  'shipping',
  'payment',
  'promotionCode',
  'status',
])

function bodyOf(request) {
  return request.body ?? {}
}

function sanitizeOrderBody(body) {
  const payload = {}

  for (const [field, value] of Object.entries(body)) {
    if (
      orderFields.has(field)
      && !field.startsWith('$')
      && !field.includes('.')
    ) {
      payload[field] = value
    }
  }

  return payload
}

function computeTotals(body, items) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  const shippingCost = Number(body.shipping?.cost ?? 0)
  const discount = 0
  const total = subtotal + shippingCost - discount

  return { discount, shippingCost, subtotal, total }
}

async function listOrders(request, response) {
  const filter = {}

  if (request.query.userId) {
    if (!mongoose.isObjectIdOrHexString(request.query.userId)) {
      return response.status(400).json({
        message: 'El identificador de usuario enviado no es válido.',
      })
    }

    filter.user = request.query.userId
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 })

  response.json({ count: orders.length, orders })
}

async function getOrder(request, response) {
  const order = await Order.findById(request.params.id)

  if (!order) {
    return response.status(404).json({
      message: 'No se encontró la orden solicitada.',
    })
  }

  return response.json({ order })
}

async function createOrder(request, response) {
  const body = bodyOf(request)
  const payload = sanitizeOrderBody(body)
  const items = Array.isArray(payload.items) ? payload.items : []
  const totals = computeTotals(body, items)

  const order = await Order.create({
    ...payload,
    items,
    ...totals,
  })

  response.status(201).json({
    message: 'Orden registrada correctamente.',
    order,
  })
}

async function updateOrder(request, response) {
  const body = bodyOf(request)
  const order = await Order.findById(request.params.id)

  if (!order) {
    return response.status(404).json({
      message: 'No se encontró la orden solicitada.',
    })
  }

  if (body.status !== undefined) {
    order.status = body.status
  }

  if (body.subtotal !== undefined) {
    order.subtotal = Number(body.subtotal)
  }

  if (body.shippingCost !== undefined) {
    order.shippingCost = Number(body.shippingCost)
  }

  if (body.discount !== undefined) {
    order.discount = Number(body.discount)
  }

  if (body.total !== undefined) {
    order.total = Number(body.total)
  }

  await order.save()

  return response.json({
    message: 'Orden actualizada correctamente.',
    order,
  })
}

async function deleteOrder(request, response) {
  const order = await Order.findByIdAndUpdate(
    request.params.id,
    { status: 'cancelled' },
    { returnDocument: 'after', runValidators: true },
  )

  if (!order) {
    return response.status(404).json({
      message: 'No se encontró la orden solicitada.',
    })
  }

  return response.json({
    message: 'Orden cancelada correctamente.',
    order,
  })
}

module.exports = {
  createOrder,
  deleteOrder,
  getOrder,
  listOrders,
  updateOrder,
}