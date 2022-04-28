const express = require('express')
const generateToken = require('../config/generateToken')
const User = require('../models/userModel')
const Customer = require('../models/customerModel')

const registerCustomer = async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please Enter all the fields' })
  }

  const userExists = await User.findOne({ role: { $eq: 'customer' }, email })

  console.log(userExists)

  if (userExists) {
    res.status(400).send({
      error: 'Customer already Exist'
    })
    return
  }

  const user = await User.create({ name, email, password, role })

  const customer = await Customer.create({ customer: user._id })

  if (user) {
    res.status(201).json({
      ...customer._doc,
      token: generateToken(user._id)
    })
  } else res.status(400).send({ error: 'Failed to create restaurant' })
}

const authCustomer = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    req.status(400).json({ error: 'Please Enter all the fields' })
  }

  const user = await User.findOne({ role: { $eq: 'customer' }, email })

  if (!user) {
    res.status(400).send({ error: 'user not Found. Please SignUp' })
    return
  }

  const customer = await Customer.findOne({
    customer: user._id
  })

  if (user && user.matchPassword(password)) {
    res.status(201).json({ ...customer._doc, token: generateToken(user._id) })
  } else {
    res.status(400).send({ error: 'Passwords dont match' })
  }
}

const updatePic = async (req, res) => {
  const { pic } = req.body

  try {
    const customer = await Customer.findOneAndUpdate(
      { customer: { _id: req.id } },
      {
        pic: pic
      }
    )
    res.status(201).json(customer)
  } catch (error) {
    console.log(error)
  }
}

const updateOrders = async (req, res) => {
  const { restaurant, items } = req.body

  try {
    const customer = await Customer.findOneAndUpdate(
      { customer: { _id: req.id } },
      {
        $push: {
          orders: {
            restaurant: restaurant,
            items: items
          }
        }
      }
    ).populate({
      path: 'orders',
      populate: {
        path: 'restaurant',
        populate: {
          path: 'restaurant'
        }
      }
    })
    res.status(201).json(customer)
  } catch (error) {
    console.log(error)
  }
}

const updateAddress = async (req, res) => {
  const { address, coordinates } = req.body

  try {
    const customer = await Customer.findOneAndUpdate(
      { customer: { _id: req.id } },
      {
        $push: {
          addresses: {
            address: address,
            coordinates: coordinates
          }
        }
      }
    )
    res.status(201).json(customer)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  registerCustomer,
  authCustomer,
  updateOrders,
  updateAddress,
  updatePic
}
