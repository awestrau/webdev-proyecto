const User = require('../models/User.model')

const createFields = new Set([
  'name',
  'email',
  'password',
  'addresses',
  'paymentMethods',
  'favoriteProductIds',
])

const updatableFields = new Set([
  'name',
  'email',
  'addresses',
  'paymentMethods',
  'favoriteProductIds',
])

function sanitizeUser(user) {
  const userObject = typeof user.toObject === 'function'
    ? user.toObject({ versionKey: false })
    : user

  const { password, ...safeUser } = userObject
  return safeUser
}

function bodyOf(request) {
  return request.body ?? {}
}

function pickAllowedFields(body, allowedFields) {
  const payload = {}

  for (const [field, value] of Object.entries(body)) {
    if (
      allowedFields.has(field)
      && !field.startsWith('$')
      && !field.includes('.')
    ) {
      payload[field] = value
    }
  }

  return payload
}

function buildCreatePayload(body) {
  return pickAllowedFields(body, createFields)
}

function buildProfilePayload(body) {
  return pickAllowedFields(body, updatableFields)
}

async function listUsers(request, response) {
  const users = await User.find().sort({ createdAt: -1 })

  response.json({
    count: users.length,
    users: users.map(sanitizeUser),
  })
}

async function getUser(request, response) {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({
      message: 'No se encontró el usuario solicitado.',
    })
  }

  return response.json({ user: sanitizeUser(user) })
}

async function createUser(request, response) {
  const user = await User.create(buildCreatePayload(bodyOf(request)))

  response.status(201).json({
    message: 'Usuario registrado correctamente.',
    user: sanitizeUser(user),
  })
}

async function updateUser(request, response) {
  const payload = buildProfilePayload(bodyOf(request))
  const user = await User.findByIdAndUpdate(
    request.params.id,
    payload,
    { returnDocument: 'after', runValidators: true },
  )

  if (!user) {
    return response.status(404).json({
      message: 'No se encontró el usuario solicitado.',
    })
  }

  return response.json({
    message: 'Usuario actualizado correctamente.',
    user: sanitizeUser(user),
  })
}

async function deleteUser(request, response) {
  const user = await User.findByIdAndUpdate(
    request.params.id,
    { status: false },
    { returnDocument: 'after', runValidators: true },
  )

  if (!user) {
    return response.status(404).json({
      message: 'No se encontró el usuario solicitado.',
    })
  }

  return response.json({
    message: 'Usuario desactivado correctamente.',
    user: sanitizeUser(user),
  })
}

async function updateUserPassword(request, response) {
  const { currentPassword, newPassword } = bodyOf(request)

  if (!currentPassword || !newPassword) {
    return response.status(400).json({
      message: 'Debes enviar la contraseña actual y la nueva contraseña.',
    })
  }

  if (String(newPassword).length < 8) {
    return response.status(400).json({
      message: 'La nueva contraseña debe tener al menos 8 caracteres.',
    })
  }

  const user = await User.findById(request.params.id).select('+password')

  if (!user) {
    return response.status(404).json({
      message: 'No se encontró el usuario solicitado.',
    })
  }

  const isValid = await user.comparePassword(currentPassword)

  if (!isValid) {
    return response.status(400).json({
      message: 'La contraseña actual no es correcta.',
    })
  }

  user.password = newPassword
  await user.save()

  return response.json({
    message: 'Contraseña actualizada correctamente.',
  })
}

module.exports = {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
  updateUserPassword,
}