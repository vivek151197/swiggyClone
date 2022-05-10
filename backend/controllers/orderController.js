const Customer = require('../models/customerModel')
const Order = require('../models/orderModel')
const User = require('../models/userModel')

const createOrder = async (req, res) => {
  const { restaurant, items } = req.body
  const customer = req.id
  try {
    const order = await Order.create({ customer, restaurant, items })
    res.status(201).json(order)
  } catch (error) {
    console.log(error)
  }
}

const getOrder = async (req, res) => {
  try {
    let customer = ''

    await Order.findOne({
      _id: req.params.id
    }).then(async res => {
      customer = await Customer.findOne({ user: res.customer })
    })

    const order = await Order.findOne({ _id: req.params.id })
      .select('-customer')
      .populate([
        {
          path: 'restaurant',
          populate: { path: 'user', select: { name: 1 } }
        },
        'deliveryPartner'
      ])

    order.customer = customer
    res.status(201).json(order)
  } catch (error) {
    console.log(error)
  }
}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.id })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'restaurant',
        select: { logo: 1, user: 1 },
        populate: {
          path: 'user',
          select: { name: 1 }
        }
      })
    res.status(201).json(orders)
  } catch (error) {
    console.log(error)
  }
}

const updateOrder = async (req, res) => {
  const { deliveryPartner, deliveryStatus } = req.body

  try {
    const order = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          deliveryPartner: deliveryPartner,
          deliveryStatus: deliveryStatus
        }
      }
    )
    res.status(201).json(order)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder
}
