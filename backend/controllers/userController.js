const express = require('express')
const generateToken = require('../config/generateToken')
const User = require('../models/userModel')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please Enter all the fields' })
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).send('User already Exist')
    return
  }

  const user = await User.create({ name, email, password })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      orders: user.orders,
      token: generateToken(user._id)
    })
  }
}

const authUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    req.status(400).json({ error: 'Please Enter all the fields' })
  }

  const user = await User.findOne({ email })

  if (user && user.matchPassword(password)) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      orders: user.orders,
      token: generateToken(user._id)
    })
  }
}

const getUser = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.id })
    res.status(201).send(userData)
  } catch (error) {
    console.log(error)
  }
}

const updateOrders = async (req, res) => {
  const { restaurantName, items, deliveryStatus } = req.body
  try {
    await User.updateOne(
      { _id: req.id },
      {
        $push: {
          orders: {
            restaurantName: restaurantName,
            items: items,
            deliveryStatus: deliveryStatus
          }
        }
      }
    )
    res.status(201).json('updated')
  } catch (error) {
    console.log(error)
  }
}

module.exports = { registerUser, authUser, updateOrders, getUser }
