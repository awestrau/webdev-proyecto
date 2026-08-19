const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const addressSchema = new mongoose.Schema(
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
    _id: true,
  },
)

const paymentMethodSchema = new mongoose.Schema(
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
    _id: true,
  },
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres.'],
      maxlength: [100, 'El nombre no puede superar 100 caracteres.'],
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'El correo electrónico no tiene un formato válido.',
      ],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres.'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    paymentMethods: {
      type: [paymentMethodSchema],
      default: [],
    },
    favoriteProductIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    collection: 'users',
    strict: false,
    timestamps: true,
  },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)