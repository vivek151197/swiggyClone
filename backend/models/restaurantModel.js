const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const restaurantSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
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
      {
        name: { type: String },
        pic: {
          type: String,
          default:
            'https://png.pngtree.com/element_our/20200702/ourmid/pngtree-vector-illustration-knife-and-fork-western-food-plate-image_2283844.jpg'
        },
        price: { type: Number, min: 0 }
      }
    ]
  },
  { timestamps: true }
)

restaurantSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

restaurantSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
