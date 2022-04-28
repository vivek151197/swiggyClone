const mongoose = require('mongoose')

const deliveryPartnerSchema = mongoose.Schema({
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  online: {
    type: Boolean,
    default: false
  },
  coords: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  occupied: { type: Boolean, default: false }
})

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema)

module.exports = DeliveryPartner
