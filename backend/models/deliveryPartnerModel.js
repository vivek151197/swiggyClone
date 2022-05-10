const mongoose = require('mongoose')

const deliveryPartnerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  online: {
    type: Boolean,
    default: false
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  orderAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  occupied: { type: Boolean, default: false }
})

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema)

module.exports = DeliveryPartner
