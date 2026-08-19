const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio.'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio del producto es obligatorio.'],
      min: [0, 'El precio no puede ser negativo.'],
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria.'],
      min: [1, 'La cantidad mínima es 1.'],
    },
    platform: {
      type: String,
      required: [true, 'La plataforma es obligatoria.'],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    _id: true,
  },
)

const shippingSnapshotSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
)

const paymentSnapshotSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    last4: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}$/, 'Los últimos 4 dígitos deben ser números.'],
    },
    cardholderName: {
      type: String,
      required: true,
      trim: true,
    },
    expiry: {
      type: String,
      required: true,
      trim: true,
      match: [/^(0[1-9]|1[0-2])\/\d{4}$/, 'La fecha de vencimiento debe usar el formato MM/AAAA.'],
    },
  },
  {
    _id: false,
  },
)

const promotionSnapshotSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['fixed', 'percentage'],
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
)

const shippingAddressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    invoiceNumber: {
      type: String,
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'La orden debe incluir al menos un producto.',
      },
    },
    shipping: {
      type: shippingSnapshotSchema,
      required: [true, 'Los datos de envío son obligatorios.'],
    },
    shippingAddress: {
      type: shippingAddressSchema,
    },
    payment: {
      type: paymentSnapshotSchema,
      required: [true, 'Los datos de pago son obligatorios.'],
    },
    promotionCode: {
      type: promotionSnapshotSchema,
    },
    subtotal: {
      type: Number,
      required: [true, 'El subtotal es obligatorio.'],
      min: [0, 'El subtotal no puede ser negativo.'],
    },
    shippingCost: {
      type: Number,
      required: [true, 'El costo de envío es obligatorio.'],
      min: [0, 'El costo de envío no puede ser negativo.'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'El descuento no puede ser negativo.'],
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio.'],
      min: [0, 'El total no puede ser negativo.'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  {
    collection: 'orders',
    strict: false,
    timestamps: true,
  },
)

orderSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Order', orderSchema)