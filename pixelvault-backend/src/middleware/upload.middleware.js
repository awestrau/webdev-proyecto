const multer = require('multer')

const maximumImageSize =
  Number(process.env.MAX_IMAGE_SIZE_MB || 5) * 1024 * 1024

const uploadProductImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maximumImageSize,
    files: 8,
  },
  fileFilter(request, file, callback) {
    if (!file.mimetype.startsWith('image/')) {
      const error = new Error(
        `El archivo ${file.originalname} no es una imagen válida.`,
      )
      error.statusCode = 400
      return callback(error)
    }

    return callback(null, true)
  },
}).array('images', 8)

module.exports = uploadProductImages
