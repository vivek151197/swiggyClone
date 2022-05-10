const express = require('express')
const generateToken = require('../config/generateToken')
const User = require('../models/userModel')
const Customer = require('../models/customerModel')
const Restaurant = require('../models/restaurantModel')

const registerCustomer = async (req, res) => {
  const { name, email, password, role, address, coordinates } = req.body

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please Enter all the fields' })
  }

  const userExists = await User.findOne({ role: { $eq: 'customer' }, email })

  if (userExists) {
    res.status(400).json({
      error: 'Customer already Exist'
    })
    return
  }

  const user = await User.create({ name, email, password, role })

  await Customer.create({
    user: user._id,
    address: address,
    coordinates: coordinates
  })

  if (user) {
    res.status(201).json({
      token: generateToken(user._id)
    })
  } else res.status(400).json({ error: 'Failed to create customer' })
}

const authCustomer = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    req.status(400).json({ error: 'Please Enter all the fields' })
  }

  const user = await User.findOne({ role: { $eq: 'customer' }, email })

  if (!user) {
    res.status(400).json({ error: 'User not Found. Please SignUp' })
    return
  }

  const isPasswordMatch = await user.matchPassword(password)

  if (isPasswordMatch) {
    res.status(201).json({ token: generateToken(user._id) })
  } else {
    res.status(400).json({ error: 'Passwords dont match' })
  }
}

const updateCart = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { user: { _id: req.id } },
      {
        $set: { cart: req.body }
      }
    )
    res.status(201).json(customer)
  } catch (error) {
    console.log(error)
  }
}

const getCustomer = async (req, res) => {
  const customer = await Customer.findOne({
    user: {
      _id: req.id
    }
  }).populate('user')
  res.status(201).json(customer)
}

const displayRestaurants = async (req, res) => {
  try {
    const restaurantsToDisplay = await Restaurant.find(
      { 'menu.0': { $exists: true } },
      { user: 1, address: 1, coordinates: 1, logo: 1, menu: 1 }
    ).populate('user', { name: 1, email: 1, _id: 0 })
    res.status(201).json(restaurantsToDisplay)
  } catch (error) {
    res.status(400).json(error)
  }
}

module.exports = {
  registerCustomer,
  authCustomer,
  updateCart,
  getCustomer,
  displayRestaurants
}
