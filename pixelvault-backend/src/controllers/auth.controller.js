const jwt = require('jsonwebtoken')

const User = require('../models/User.model')
const { sanitizeUser } = require('./user.controller')

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_EXPIRES || '1d',
    },
  )
}

async function login(request, response) {
  const { email, password } = request.body ?? {}

  if (!email || !password) {
    return response.status(400).json({
      message: 'Debes enviar el correo y la contraseña.',
    })
  }

  const user = await User.findOne({
    email: String(email).trim().toLowerCase(),
  }).select('+password')

  if (!user || user.status !== true) {
    return response.status(401).json({
      message: 'Credenciales incorrectas.',
    })
  }

  const isValid = await user.comparePassword(password)

  if (!isValid) {
    return response.status(401).json({
      message: 'Credenciales incorrectas.',
    })
  }

  return response.json({
    token: signToken(user),
    user: sanitizeUser(user),
  })
}

async function me(request, response) {
  const user = await User.findOne({
    _id: request.user.id,
    status: true,
  })

  if (!user) {
    return response.status(401).json({
      message: 'No se proporcionó un token válido.',
    })
  }

  return response.json({ user: sanitizeUser(user) })
}

module.exports = {
  login,
  me,
}