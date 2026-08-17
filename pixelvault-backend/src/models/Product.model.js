const mongoose = require('mongoose')

const productImageSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres.'],
      maxlength: [100, 'El nombre no puede superar 100 caracteres.'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio.'],
      min: [0, 'El precio no puede ser negativo.'],
    },
    platform: {
      type: String,
      required: [true, 'La plataforma es obligatoria.'],
      trim: true,
      maxlength: [60, 'La plataforma no puede superar 60 caracteres.'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria.'],
      trim: true,
      maxlength: [60, 'La categoría no puede superar 60 caracteres.'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria.'],
      trim: true,
      maxlength: [1000, 'La descripción no puede superar 1000 caracteres.'],
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    collection: 'products',
    strict: false,
    timestamps: true,
  },
)

productSchema.index({ name: 1, platform: 1 })

module.exports = mongoose.model('Product', productSchema)
