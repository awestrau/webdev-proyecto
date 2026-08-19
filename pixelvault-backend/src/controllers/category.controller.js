const Category = require('../models/Category.model')

const updatableFields = new Set(['name', 'slug', 'description', 'status'])

function bodyOf(request) {
  return request.body ?? {}
}

function sanitizeCategoryBody(body) {
  const payload = {}

  for (const [field, value] of Object.entries(body)) {
    if (
      updatableFields.has(field)
      && !field.startsWith('$')
      && !field.includes('.')
    ) {
      payload[field] = value
    }
  }

  return payload
}

async function listCategories(request, response) {
  const includeInactive = request.query.includeInactive === 'true'
  const filter = includeInactive ? {} : { status: true }
  const categories = await Category.find(filter).sort({ name: 1 })

  response.json({ count: categories.length, categories })
}

async function getCategory(request, response) {
  const category = await Category.findById(request.params.id)

  if (!category) {
    return response.status(404).json({
      message: 'No se encontró la categoría solicitada.',
    })
  }

  return response.json({ category })
}

async function createCategory(request, response) {
  const category = await Category.create(sanitizeCategoryBody(bodyOf(request)))

  response.status(201).json({
    message: 'Categoría registrada correctamente.',
    category,
  })
}

async function updateCategory(request, response) {
  const category = await Category.findByIdAndUpdate(
    request.params.id,
    sanitizeCategoryBody(bodyOf(request)),
    { returnDocument: 'after', runValidators: true },
  )

  if (!category) {
    return response.status(404).json({
      message: 'No se encontró la categoría solicitada.',
    })
  }

  return response.json({
    message: 'Categoría actualizada correctamente.',
    category,
  })
}

async function deleteCategory(request, response) {
  const category = await Category.findByIdAndUpdate(
    request.params.id,
    { status: false },
    { returnDocument: 'after', runValidators: true },
  )

  if (!category) {
    return response.status(404).json({
      message: 'No se encontró la categoría solicitada.',
    })
  }

  return response.json({
    message: 'Categoría desactivada correctamente.',
    category,
  })
}

module.exports = {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
}