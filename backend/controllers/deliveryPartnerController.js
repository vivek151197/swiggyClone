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
      .send({ error: 'Delivery Partner already Exist. Please SignIn' })
    return
  }

  const user = await User.create({ name, email, password, role })

  await DeliveryPartner.create({
    deliveryPartner: user._id
  })
  const deliveryPartner = await DeliveryPartner.findOne({
    deliveryPartner: user._id
  }).populate('deliveryPartner', { name: 1, email: 1, _id: -1 })

  if (user) {
    res
      .status(201)
      .json({ ...deliveryPartner._doc, token: generateToken(user._id) })
  } else res.status(400).send({ error: 'Failed to create delivery Partner' })
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
      .send({ error: 'DeliveryPartner not present. Please SignUp' })
    return
  }

  const deliveryPartner = await DeliveryPartner.findOne({
    deliveryPartner: user._id
  }).populate('deliveryPartner', { name: 1, email: 1, _id: -1 })
  const isPasswordMatch = await user.matchPassword(password)

  if (isPasswordMatch) {
    res
      .status(201)
      .json({ ...deliveryPartner._doc, token: generateToken(user._id) })
  } else {
    res.status(400).send({ error: 'Passwords did not match' })
  }
}

const updateDetails = async (req, res) => {
  const { coords, onlineStatus, occupied } = req.body
  try {
    const data = await DeliveryPartner.updateOne(
      {
        deliveryPartner: {
          _id: req.id
        }
      },
      {
        $set: {
          online: onlineStatus,
          coords: coords,
          occupied: occupied
        }
      }
    )
    res.status(201).json(data)
  } catch (error) {
    console.log(error)
  }
}

const displayDeliveryPartners = async (req, res) => {
  try {
    const deliveryPartners = await DeliveryPartner.find({
      online: true,
      occupied: false
    })
    res.status(201).json(deliveryPartners)
  } catch (error) {
    res.status(400).json(error)
  }
}

module.exports = {
  registerDeliveryPartner,
  authDeliveryPartner,
  updateDetails,
  displayDeliveryPartners
}
