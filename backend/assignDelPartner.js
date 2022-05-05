const DeliveryPartner = require('./models/deliveryPartnerModel')
const Order = require('./models/orderModel')

const findDist = (coord1, coord2) => {
  return Math.sqrt(
    ((coord1.latitude - coord2.latitude) ^ 2) -
      ((coord1.longitude - coord2.longitude) ^ 2)
  )
}

const findMinDist = (targetCoords, arrayOfCoords) => {
  let minDist = 0
  let deliveryIndex = 0
  arrayOfCoords.forEach((coord, index) => {
    const distance = findDist(targetCoords, coord)
    minDist = distance
    if (index > 0 && minDist > distance) {
      deliveryIndex = index
    }
  })
  return deliveryIndex
}

async function assignDelPartner (orderId) {
  const order = await Order.findOne({ _id: orderId }).populate('restaurant')
  const restCoords = order.restaurant.coordinates

  const deliveryPartners = await DeliveryPartner.find({
    online: true,
    occupied: false
  })

  const deliveryPartnersCoords = deliveryPartners.map(
    partner => partner.coordinates
  )

  const deliveryPartner =
    deliveryPartners[findMinDist(restCoords, deliveryPartnersCoords)]

  const id = deliveryPartner ? deliveryPartner._id : null

  console.log(id)

  return id
}

module.exports = { assignDelPartner }
