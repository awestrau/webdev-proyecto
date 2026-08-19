const mongoose = require('mongoose')

const Order = require('../models/Order.model')
const Product = require('../models/Product.model')
const ShippingOption = require('../models/ShippingOption.model')

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

// 'status' NO está en el whitelist a propósito: el cliente no debe poder
// forzar el estado de una orden al crearla (siempre queda 'pending' por
// defecto). PUT /:id (admin-only) sigue permitiendo cambiarlo vía su lógica.
// 'user' tampoco: el dueño de la orden siempre se toma del token.
const orderFields = new Set([
  'items',
  'shipping',
  'payment',
  'promotionCode',
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

// computeTotals recibe el payload SANEADO (no el body crudo) y los ítems
// ya resueltos contra la BD (precio real del producto).
function computeTotals(payload, items) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  const shippingCost = Number(payload.shipping?.cost ?? 0)
  const discount = 0
  const total = subtotal + shippingCost - discount

  return { discount, shippingCost, subtotal, total }
}

async function resolveOrderItems(rawItems) {
  const resolvedItems = []

  for (const item of rawItems) {
    const productId = item?.product

    if (!mongoose.isObjectIdOrHexString(productId)) {
      const error = new Error(
        'Cada ítem de la orden debe referenciar un producto válido.',
      )
      error.statusCode = 400
      throw error
    }

    const product = await Product.findById(productId)

    if (!product) {
      const error = new Error('Uno de los productos no existe en el catálogo.')
      error.statusCode = 400
      throw error
    }

    // Se toman nombre, precio y plataforma del catálogo; los datos que
    // envíe el cliente para estos campos se ignoran (snapshot confiable).
    resolvedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: Number(item.quantity) >= 1 ? Math.trunc(Number(item.quantity)) : 1,
      platform: product.platform,
    })
  }

  return resolvedItems
}

async function resolveShipping(payload) {
  const requestedCost = Number(payload.shipping?.cost)

  // Se busca la opción real por costo (y por label cuando el cliente la envía).
  const filter = { cost: requestedCost }

  if (typeof payload.shipping?.label === 'string' && payload.shipping.label.trim()) {
    filter.label = payload.shipping.label.trim()
  }

  const shippingOption = await ShippingOption.findOne(filter)

  if (!shippingOption) {
    const error = new Error('La opción de envío seleccionada no es válida.')
    error.statusCode = 400
    throw error
  }

  return {
    label: shippingOption.label,
    cost: shippingOption.cost,
  }
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
  const rawItems = Array.isArray(payload.items) ? payload.items : []
  const items = await resolveOrderItems(rawItems)

  if (items.length === 0) {
    return response.status(400).json({
      message: 'La orden debe incluir al menos un producto.',
    })
  }

  // El dueño de la orden SIEMPRE es el usuario autenticado; cualquier
  // 'user' enviado en el body se ignora.
  const user = request.user.id

  // Envío validado contra la colección shippingOptions (costo real).
  const shipping = await resolveShipping(payload)

  // computeTotals recibe el payload saneado y los ítems resueltos contra BD.
  const totals = computeTotals({ ...payload, shipping }, items)

  const order = await Order.create({
    user,
    items,
    shipping,
    payment: payload.payment,
    promotionCode: payload.promotionCode,
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
    if (!ORDER_STATUSES.includes(body.status)) {
      return response.status(400).json({
        message: 'El estado de la orden enviado no es válido.',
      })
    }

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