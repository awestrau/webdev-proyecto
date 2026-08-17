const mongoose = require('mongoose')

const shippingOptionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
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
    collection: 'shippingOptions',
    id: false,
    strict: false,
    timestamps: true,
  },
)

module.exports = mongoose.model('ShippingOption', shippingOptionSchema)
