const mongoose = require('mongoose')

const Cart = require('../models/Cart.model')
const Product = require('../models/Product.model')

const cartFields = new Set(['user', 'items'])

function bodyOf(request) {
  return request.body ?? {}
}

function sanitizeCartBody(body) {
  const payload = {}

  for (const [field, value] of Object.entries(body)) {
    if (
      cartFields.has(field)
      && !field.startsWith('$')
      && !field.includes('.')
    ) {
      payload[field] = value
    }
  }

  return payload
}

function normalizeItems(items) {
  return Array.isArray(items) ? items : []
}

async function productsExist(items) {
  const productIds = items
    .map((item) => item?.product)
    .filter((id) => mongoose.isObjectIdOrHexString(id))

  if (productIds.length === 0) {
    return true
  }

  const count = await Product.countDocuments({ _id: { $in: productIds } })
  return count === productIds.length
}

async function listCarts(request, response) {
  const carts = await Cart.find().sort({ createdAt: -1 })

  response.json({ count: carts.length, carts })
}

async function getCartByUser(request, response) {
  const cart = await Cart.findOne({ user: request.params.userId })

  if (!cart) {
    return response.status(404).json({
      message: 'No se encontró el carrito para el usuario solicitado.',
    })
  }

  return response.json({ cart })
}

async function getCart(request, response) {
  const cart = await Cart.findById(request.params.id)

  if (!cart) {
    return response.status(404).json({
      message: 'No se encontró el carrito solicitado.',
    })
  }

  return response.json({ cart })
}

async function createCart(request, response) {
  const body = sanitizeCartBody(bodyOf(request))
  const { user, items } = body

  if (!user) {
    return response.status(400).json({
      message: 'El carrito debe indicar el identificador del usuario.',
    })
  }

  if (!mongoose.isObjectIdOrHexString(user)) {
    return response.status(400).json({
      message: 'El identificador de usuario enviado no es válido.',
    })
  }

  const incomingItems = normalizeItems(items)
  const validItems = incomingItems.filter((item) => {
    return mongoose.isObjectIdOrHexString(item?.product)
  })

  if (!(await productsExist(validItems))) {
    return response.status(400).json({
      message: 'Uno de los productos no existe en el catálogo.',
    })
  }

  const existingCart = await Cart.findOne({ user })

  if (!existingCart) {
    const cart = await Cart.create({ user, items: validItems })

    return response.status(201).json({
      message: 'Carrito creado correctamente.',
      cart,
    })
  }

  for (const incoming of validItems) {
    const matchingItem = existingCart.items.find((item) => {
      return String(item.product) === String(incoming.product)
    })

    if (matchingItem) {
      matchingItem.quantity += Number(incoming.quantity) || 1
    } else {
      existingCart.items.push({
        product: incoming.product,
        quantity: Number(incoming.quantity) || 1,
      })
    }
  }

  await existingCart.save()

  return response.json({
    message: 'Los productos se agregaron al carrito existente.',
    cart: existingCart,
  })
}

async function updateCart(request, response) {
  const body = sanitizeCartBody(bodyOf(request))
  const incomingItems = normalizeItems(body.items)
  const validItems = incomingItems.filter((item) => {
    return mongoose.isObjectIdOrHexString(item?.product)
  })

  if (validItems.length !== incomingItems.length) {
    return response.status(400).json({
      message: 'Uno de los productos no existe en el catálogo.',
    })
  }

  if (!(await productsExist(validItems))) {
    return response.status(400).json({
      message: 'Uno de los productos no existe en el catálogo.',
    })
  }

  const cart = await Cart.findByIdAndUpdate(
    request.params.id,
    { items: validItems },
    { returnDocument: 'after', runValidators: true },
  )

  if (!cart) {
    return response.status(404).json({
      message: 'No se encontró el carrito solicitado.',
    })
  }

  return response.json({
    message: 'Carrito actualizado correctamente.',
    cart,
  })
}

async function deleteCart(request, response) {
  const cart = await Cart.findByIdAndDelete(request.params.id)

  if (!cart) {
    return response.status(404).json({
      message: 'No se encontró el carrito solicitado.',
    })
  }

  return response.json({
    message: 'Carrito eliminado correctamente.',
  })
}

async function clearCartByUser(request, response) {
  const cart = await Cart.findOneAndUpdate(
    { user: request.params.userId },
    { items: [] },
    { returnDocument: 'after', runValidators: true },
  )

  if (!cart) {
    return response.status(404).json({
      message: 'No se encontró el carrito para el usuario solicitado.',
    })
  }

  return response.json({
    message: 'Carrito vaciado correctamente.',
    cart,
  })
}

module.exports = {
  clearCartByUser,
  createCart,
  deleteCart,
  getCart,
  getCartByUser,
  listCarts,
  updateCart,
}