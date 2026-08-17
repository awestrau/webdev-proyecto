function buildImageUrl(request, fileId) {
  return `${request.protocol}://${request.get('host')}/api/products/images/${fileId}`
}

function presentProduct(product, request) {
  const productObject = typeof product.toObject === 'function'
    ? product.toObject({ versionKey: false })
    : product

  const imageFiles = (productObject.images || []).map((image) => ({
    id: String(image.fileId),
    filename: image.filename,
    originalName: image.originalName,
    mimeType: image.mimeType,
    size: image.size,
    url: buildImageUrl(request, image.fileId),
  }))

  return {
    ...productObject,
    id: String(productObject._id),
    _id: String(productObject._id),
    images: imageFiles.map((image) => image.url),
    imageFiles,
  }
}

module.exports = presentProduct
