const express = require('express')
const generateToken = require('../config/generateToken')
const Restaurant = require('../models/restaurantModel')

const registerRestaurant = async (req, res) => {
  const { email, password, name, address } = req.body
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Please Enter all Fields' })
  }

  const restaurantExists = await Restaurant.findOne({ email })

  if (restaurantExists) {
    res.status(400).send('Restaurant already exists')
    return
  }

  const restaurant = await Restaurant.create({
    email,
    password,
    name,
    address
  })

  if (restaurant) {
    res.status(201).json({
      _id: restaurant._id,
      email: restaurant.email,
      name: restaurant.name,
      address: restaurant.address,
      logo: restaurant.logo,
      menu: restaurant.menu,
      coords: restaurant.coords,
      token: generateToken(restaurant._id)
    })
  } else res.status(400).send('Failed to create restaurant')
}

const authRestaurant = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Please Enter all Fields' })
  }

  const restaurant = await Restaurant.findOne({ email })
  if (restaurant && restaurant.matchPassword(password)) {
    res.status(201).json({
      _id: restaurant._id,
      email: restaurant.email,
      name: restaurant.name,
      address: restaurant.address,
      coords: restaurant.coords,
      logo: restaurant.logo,
      menu: restaurant.menu,
      token: generateToken(restaurant._id)
    })
  } else {
    res.status(400).json({ error: 'Restaurant doesnt exist. Please signUp' })
  }
}

const updateDetails = async (req, res) => {
  const { name, address, coords, logo, menu } = req.body
  try {
    console.log(name, address)
    const data = await Restaurant.updateOne(
      { _id: req.id },
      {
        $set: {
          name: name,
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
      { name: 1, address: 1, coords: 1, logo: 1, menu: 1 }
    )
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
