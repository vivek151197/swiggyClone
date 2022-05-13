const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: Object,
      required: true,
      ref: 'User'
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant'
    },
    items: [
      {
        food: { type: String },
        price: { type: Number },
        quantity: { type: Number }
      }
    ],
    deliveryPartner: { type: String, ref: 'deliveryPartner' },
    deliveryStatus: { type: Number, default: 0 }
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
