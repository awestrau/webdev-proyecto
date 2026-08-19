const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio.'],
      unique: true,
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres.'],
      maxlength: [60, 'El nombre no puede superar 60 caracteres.'],
    },
    slug: {
      type: String,
      required: [true, 'El slug de la categoría es obligatorio.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo admite minúsculas, números y guiones.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres.'],
    },
    status: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    collection: 'categories',
    strict: false,
    timestamps: true,
  },
)

module.exports = mongoose.model('Category', categorySchema)