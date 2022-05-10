const express = require('express')
const generateToken = require('../config/generateToken')
const DeliveryPartner = require('../models/deliveryPartnerModel')
const User = require('../models/userModel')

const registerDeliveryPartner = async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please Enter all the fields' })
  }

  const userExists = await User.findOne({
    role: { $eq: 'deliveryPartner' },
    email
  })

  if (userExists) {
    res
      .status(400)
      .json({ error: 'Delivery Partner already Exist. Please SignIn' })
    return
  }

  const user = await User.create({ name, email, password, role })

  await DeliveryPartner.create({
    user: user._id
  })

  if (user) {
    res.status(201).json({ token: generateToken(user._id) })
  } else res.status(400).json({ error: 'Failed to create delivery Partner' })
}

const authDeliveryPartner = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    req.status(400).json({ error: 'Please Enter all the fields' })
  }

  const user = await User.findOne({ role: { $eq: 'deliveryPartner' }, email })
  if (!user) {
    res
      .status(400)
      .json({ error: 'DeliveryPartner not present. Please SignUp' })
    return
  }

  const isPasswordMatch = await user.matchPassword(password)

  if (isPasswordMatch) {
    res.status(201).json({ token: generateToken(user._id) })
  } else {
    res.status(400).json({ error: 'Passwords did not match' })
  }
}

const updateDeliveryPartner = async (req, res) => {
  const { coordinates, online, occupied, orderAssigned } = req.body

  try {
    const data = await DeliveryPartner.updateOne(
      {
        user: {
          _id: req.id
        }
      },
      {
        $set: {
          online: online,
          coordinates: coordinates,
          orderAssigned: orderAssigned,
          occupied: occupied
        }
      }
    )
    res.status(201).json(data)
  } catch (error) {
    console.log(error)
  }
}

const getDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findOne({
      user: req.id
    }).populate('user', { name: 1 })
    res.status(400).json(deliveryPartner)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  registerDeliveryPartner,
  authDeliveryPartner,
  updateDeliveryPartner,
  getDeliveryPartner
}
