const express = require('express')
const generateToken = require('../config/generateToken')
const Restaurant = require('../models/restaurantModel')
const User = require('../models/userModel')

const registerRestaurant = async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please Enter all the fields' })
  }

  const userExists = await User.findOne({ role: { $eq: 'restaurant' }, email })

  if (userExists) {
    res.status(400).send({ error: 'Restaurant already Exist' })
    return
  }

  const user = await User.create({ name, email, password, role })

  await Restaurant.create({ restaurant: user._id })

  const restaurant = await Restaurant.findOne({
    restaurant: user._id
  }).populate('restaurant', { name: 1, email: 1, _id: -1 })

  if (user) {
    res.status(201).json({ ...restaurant._doc, token: generateToken(user._id) })
  } else res.status(400).json({ error: 'Failed to create restaurant' })
}

const authRestaurant = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    req.status(400).json({ error: 'Please Enter all the fields' })
  }

  const user = await User.findOne({ role: { $eq: 'restaurant' }, email })
  if (!user) {
    res.status(400).json({ error: 'Restaurant not present. Please SignUp' })
    return
  }
  const restaurant = await Restaurant.findOne({
    restaurant: user._id
  }).populate('restaurant', { name: 1, email: 1, _id: -1 })

  const isPasswordMatch = await user.matchPassword(password)

  if (isPasswordMatch) {
    res.status(201).json({ ...restaurant._doc, token: generateToken(user._id) })
  } else {
    res.status(400).json({ error: 'Passwords did not match' })
  }
}

const updateDetails = async (req, res) => {
  const { name, address, coords, logo, menu } = req.body
  try {
    User.updateOne({ _id: req.id }, { name: name })
    const data = await Restaurant.updateOne(
      {
        restaurant: {
          _id: req.id
        }
      },
      {
        $set: {
          address: address,
          coords: coords,
          logo: logo,
          menu: menu
        }
      }
    )
    res.status(201).json(data)
  } catch (error) {
    console.log(error)
  }
}

const displayRestaurants = async (req, res) => {
  try {
    const restaurantsToDisplay = await Restaurant.find(
      { 'menu.0': { $exists: true } },
      { restaurant: 1, address: 1, coords: 1, logo: 1, menu: 1 }
    ).populate('restaurant', { name: 1, email: 1, _id: 0 })
    res.status(201).json(restaurantsToDisplay)
  } catch (error) {
    res.status(400).json(error)
  }
}

module.exports = {
  registerRestaurant,
  authRestaurant,
  updateDetails,
  displayRestaurants
}
