const mongoose = require('mongoose')

const Product = require('../models/Product.model')
const presentProduct = require('../presenters/product.presenter')
const {
  deleteImages,
  openImageDownloadStream,
  storeImages,
} = require('../services/image.service')

const reservedFields = new Set([
  '_id',
  'id',
  '__v',
  'createdAt',
  'updatedAt',
  'images',
  'imageFiles',
  'removeImageIds',
])

function parseBoolean(value, defaultValue) {
  if (value === undefined) {
    return defaultValue
  }

  if (value === true || value === 'true') {
    return true
  }

  if (value === false || value === 'false') {
    return false
  }

  const error = new Error('El estado debe ser true o false.')
  error.statusCode = 400
  throw error
}

function buildProductPayload(body, { partial = false } = {}) {
  const payload = {}

  for (const [field, value] of Object.entries(body)) {
    if (
      reservedFields.has(field)
      || field.startsWith('$')
      || field.includes('.')
    ) {
      continue
    }

    payload[field] = value
  }

  if (body.price !== undefined) {
    payload.price = Number(body.price)
  }

  if (body.status !== undefined || !partial) {
    payload.status = parseBoolean(body.status, true)
  }

  return payload
}

function parseImageIds(value) {
  if (!value) {
    return []
  }

  let values = value

  if (typeof value === 'string') {
    try {
      values = JSON.parse(value)
    } catch {
      const error = new Error(
        'La lista de imágenes que se desea eliminar no es válida.',
      )
      error.statusCode = 400
      throw error
    }
  }

  if (!Array.isArray(values)) {
    const error = new Error(
      'La lista de imágenes que se desea eliminar debe ser un arreglo.',
    )
    error.statusCode = 400
    throw error
  }

  return values
    .map(String)
    .filter((id) => mongoose.isObjectIdOrHexString(id))
}

async function listProducts(request, response) {
  const includeInactive = request.query.includeInactive === 'true'
  const filter = includeInactive ? {} : { status: true }
  const products = await Product.find(filter).sort({ createdAt: -1 })

  response.json({
    count: products.length,
    products: products.map((product) => presentProduct(product, request)),
  })
}

async function getProduct(request, response) {
  const includeInactive = request.query.includeInactive === 'true'
  const filter = {
    _id: request.params.id,
    ...(includeInactive ? {} : { status: true }),
  }
  const product = await Product.findOne(filter)

  if (!product) {
    return response.status(404).json({
      message: 'No se encontró el producto solicitado.',
    })
  }

  return response.json({
    product: presentProduct(product, request),
  })
}

async function createProduct(request, response) {
  let storedImages = []

  try {
    storedImages = await storeImages(request.files)

    const product = await Product.create({
      ...buildProductPayload(request.body),
      images: storedImages,
    })

    return response.status(201).json({
      message: 'Producto registrado correctamente.',
      product: presentProduct(product, request),
    })
  } catch (error) {
    await deleteImages(storedImages.map((image) => image.fileId))
    throw error
  }
}

async function updateProduct(request, response) {
  const product = await Product.findById(request.params.id)

  if (!product) {
    return response.status(404).json({
      message: 'No se encontró el producto que deseas editar.',
    })
  }

  const removeImageIds = parseImageIds(request.body.removeImageIds)
  const removableImageIds = product.images
    .map((image) => String(image.fileId))
    .filter((id) => removeImageIds.includes(id))

  let newImages = []

  try {
    newImages = await storeImages(request.files)

    product.set(buildProductPayload(request.body, { partial: true }))
    product.images = product.images
      .filter((image) => !removableImageIds.includes(String(image.fileId)))
      .concat(newImages)

    await product.save()
  } catch (error) {
    await deleteImages(newImages.map((image) => image.fileId))
    throw error
  }

  try {
    await deleteImages(removableImageIds)
  } catch (error) {
    // La edición del producto ya fue guardada. Un archivo huérfano no debe
    // revertir la respuesta ni eliminar las imágenes nuevas que sí se usan.
    console.error('No fue posible limpiar una imagen reemplazada:', error)
  }

  return response.json({
    message: 'Producto actualizado correctamente.',
    product: presentProduct(product, request),
  })
}

async function updateProductStatus(request, response) {
  const body = request.body ?? {}

  if (body.status === undefined) {
    return response.status(400).json({
      message: 'Debes indicar el estado del producto (true o false).',
    })
  }

  const status = parseBoolean(body.status)
  const product = await Product.findByIdAndUpdate(
    request.params.id,
    { status },
    { returnDocument: 'after', runValidators: true },
  )

  if (!product) {
    return response.status(404).json({
      message: 'No se encontró el producto solicitado.',
    })
  }

  return response.json({
    message: status
      ? 'Producto activado correctamente.'
      : 'Producto desactivado correctamente.',
    product: presentProduct(product, request),
  })
}

async function deactivateProduct(request, response) {
  const product = await Product.findByIdAndUpdate(
    request.params.id,
    { status: false },
    { returnDocument: 'after', runValidators: true },
  )

  if (!product) {
    return response.status(404).json({
      message: 'No se encontró el producto solicitado.',
    })
  }

  return response.json({
    message: 'Producto desactivado correctamente.',
    product: presentProduct(product, request),
  })
}

async function streamProductImage(request, response, next) {
  const imageId = request.params.imageId
  const product = await Product.findOne({
    'images.fileId': imageId,
  })

  if (!product) {
    return response.status(404).json({
      message: 'No se encontró la imagen solicitada.',
    })
  }

  const image = product.images.find((item) => {
    return String(item.fileId) === imageId
  })

  response.set({
    'Cache-Control': 'public, max-age=86400',
    'Content-Disposition': `inline; filename="${image.filename}"`,
    'Content-Type': image.mimeType,
  })

  const downloadStream = openImageDownloadStream(imageId)
  downloadStream.on('error', next)
  return downloadStream.pipe(response)
}

module.exports = {
  createProduct,
  deactivateProduct,
  getProduct,
  listProducts,
  streamProductImage,
  updateProduct,
  updateProductStatus,
}
