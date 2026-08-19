const PromotionCode = require('../models/PromotionCode.model')

async function listPromotionCodes(request, response) {
  const promotionCodes = await PromotionCode.find().sort({ code: 1 })
  response.json({ count: promotionCodes.length, promotionCodes })
}

async function getPromotionCode(request, response) {
  const promotionCode = await PromotionCode.findById(request.params.id)

  if (!promotionCode) {
    return response.status(404).json({
      message: 'No se encontró el código promocional.',
    })
  }

  return response.json({ promotionCode })
}

async function createPromotionCode(request, response) {
  const promotionCode = await PromotionCode.create(request.body)
  response.status(201).json({
    message: 'Código promocional registrado correctamente.',
    promotionCode,
  })
}

async function updatePromotionCode(request, response) {
  const promotionCode = await PromotionCode.findByIdAndUpdate(
    request.params.id,
    request.body,
    { returnDocument: 'after', runValidators: true },
  )

  if (!promotionCode) {
    return response.status(404).json({
      message: 'No se encontró el código promocional.',
    })
  }

  return response.json({
    message: 'Código promocional actualizado correctamente.',
    promotionCode,
  })
}

async function deletePromotionCode(request, response) {
  const promotionCode = await PromotionCode.findByIdAndDelete(
    request.params.id,
  )

  if (!promotionCode) {
    return response.status(404).json({
      message: 'No se encontró el código promocional.',
    })
  }

  return response.json({
    message: 'Código promocional eliminado correctamente.',
  })
}

module.exports = {
  createPromotionCode,
  deletePromotionCode,
  getPromotionCode,
  listPromotionCodes,
  updatePromotionCode,
}
