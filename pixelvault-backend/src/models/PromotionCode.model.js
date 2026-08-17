const mongoose = require('mongoose')

const promotionCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
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
    collection: 'promotionCodes',
    strict: false,
    timestamps: true,
  },
)

module.exports = mongoose.model('PromotionCode', promotionCodeSchema)
