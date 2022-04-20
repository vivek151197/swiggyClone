const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pic: {
    type: String,
    required: true,
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  orders: [
    new mongoose.Schema(
      {
        restaurantName: { type: String },
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

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

module.exports = User
