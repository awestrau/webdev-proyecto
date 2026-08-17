const mongoose = require('mongoose')

function validateObjectId(parameterName = 'id') {
  return function validateRequestParameter(request, response, next) {
    const value = request.params[parameterName]

    if (!mongoose.isObjectIdOrHexString(value)) {
      return response.status(400).json({
        message: 'El identificador enviado no es válido.',
      })
    }

    return next()
  }
}

module.exports = validateObjectId
