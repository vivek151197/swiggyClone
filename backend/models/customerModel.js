const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pic: {
    type: String,
    required: true,
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  orders: [
    new mongoose.Schema(
      {
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
        items: [
          {
            food: { type: String },
            price: { type: Number },
            quantity: { type: Number }
          }
        ],
        deliveryStatus: { type: String }
      },
      {
        timestamps: true
      }
    )
  ]
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
