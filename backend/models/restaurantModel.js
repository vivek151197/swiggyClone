const mongoose = require('mongoose')

const restaurantSchema = mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  address: { type: String },
  coords: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  logo: {
    type: String,
    required: true,
    default:
      'https://b.zmtcdn.com/web/assets/search/6d548ba48f0e4e4b46c19ad4b15a3f011615379209.jpeg'
  },
  menu: [
    new mongoose.Schema({
      name: { type: String },
      pic: {
        type: String,
        default:
          'https://png.pngtree.com/element_our/20200702/ourmid/pngtree-vector-illustration-knife-and-fork-western-food-plate-image_2283844.jpg'
      },
      price: { type: Number, min: 0 }
    })
  ]
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
