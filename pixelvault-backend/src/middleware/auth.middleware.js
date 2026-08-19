const jwt = require('jsonwebtoken')

const User = require('../models/User.model')

function requireAuth(request, response, next) {
  const header = request.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({
      message: 'No se proporcionó un token válido.',
    })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    })
    request.user = {
      id: payload.id,
      role: payload.role,
    }

    return next()
  } catch (error) {
    return response.status(401).json({
      message: 'No se proporcionó un token válido.',
    })
  }
}

function requireAdmin(request, response, next) {
  // requireAuth nunca invoca next con un error: solo responde 401 por su
  // cuenta o continúa con request.user seteado. El callback de abajo se
  // ejecuta únicamente cuando el usuario ya está autenticado.
  return requireAuth(request, response, async () => {
    try {
      const user = await User.findById(request.user.id)

      // status !== true (consistente con login/me): un usuario con status
      // undefined o false NO pasa el filtro de administrador.
      if (!user || user.role !== 'admin' || user.status !== true) {
        return response.status(403).json({
          message: 'Se requieren permisos de administrador.',
        })
      }

      return next()
    } catch (error) {
      return next(error)
    }
  })
}

module.exports = {
  requireAdmin,
  requireAuth,
}
