const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El carrito debe referenciar un producto.'],
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria.'],
      min: [1, 'La cantidad mínima es 1.'],
      default: 1,
    },
  },
  {
    _id: true,
  },
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El carrito debe pertenecer a un usuario.'],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    collection: 'carts',
    strict: false,
    timestamps: true,
  },
)

module.exports = mongoose.model('Cart', cartSchema)