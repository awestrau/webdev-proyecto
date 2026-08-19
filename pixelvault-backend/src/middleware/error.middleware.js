const multer = require('multer')

function notFoundHandler(request, response) {
  response.status(404).json({
    message: `No existe el endpoint ${request.method} ${request.originalUrl}.`,
  })
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Una imagen supera el tamaño máximo permitido.'
      : 'No fue posible procesar las imágenes enviadas.'

    return response.status(400).json({ message })
  }

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((item) => item.message)

    return response.status(400).json({
      message: 'Los datos enviados no son válidos.',
      details,
    })
  }

  if (error.name === 'CastError') {
    return response.status(400).json({
      message: 'El identificador enviado no es válido.',
    })
  }

  if (error.code === 11000) {
    return response.status(409).json({
      message: 'Ya existe un registro con esos datos únicos.',
    })
  }

  const statusCode = error.statusCode || 500

  if (statusCode >= 500) {
    console.error(error)
  }

  return response.status(statusCode).json({
    message: statusCode >= 500
      ? 'Ocurrió un error interno en el servidor.'
      : error.message,
  })
}

module.exports = {
  errorHandler,
  notFoundHandler,
}
