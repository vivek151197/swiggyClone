const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  address: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, reqiured: true }
  },
  cart: { type: Array, default: [] }
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
