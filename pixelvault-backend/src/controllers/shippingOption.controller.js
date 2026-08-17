const ShippingOption = require('../models/ShippingOption.model')

async function listShippingOptions(request, response) {
  const shippingOptions = await ShippingOption.find().sort({ cost: 1 })
  response.json({ count: shippingOptions.length, shippingOptions })
}

async function getShippingOption(request, response) {
  const shippingOption = await ShippingOption.findById(request.params.id)

  if (!shippingOption) {
    return response.status(404).json({
      message: 'No se encontró la opción de envío.',
    })
  }

  return response.json({ shippingOption })
}

async function createShippingOption(request, response) {
  const shippingOption = await ShippingOption.create(request.body)
  response.status(201).json({
    message: 'Opción de envío registrada correctamente.',
    shippingOption,
  })
}

async function updateShippingOption(request, response) {
  const shippingOption = await ShippingOption.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true },
  )

  if (!shippingOption) {
    return response.status(404).json({
      message: 'No se encontró la opción de envío.',
    })
  }

  return response.json({
    message: 'Opción de envío actualizada correctamente.',
    shippingOption,
  })
}

async function deleteShippingOption(request, response) {
  const shippingOption = await ShippingOption.findByIdAndDelete(
    request.params.id,
  )

  if (!shippingOption) {
    return response.status(404).json({
      message: 'No se encontró la opción de envío.',
    })
  }

  return response.json({
    message: 'Opción de envío eliminada correctamente.',
  })
}

module.exports = {
  createShippingOption,
  deleteShippingOption,
  getShippingOption,
  listShippingOptions,
  updateShippingOption,
}
