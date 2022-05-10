const express = require('express')
const {
  registerDeliveryPartner,
  authDeliveryPartner,
  getDeliveryPartner,
  updateDeliveryPartner
} = require('../controllers/deliveryPartnerController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()
//register = /register and /load = /

router.route('/register').post(registerDeliveryPartner)
router.route('/login').post(authDeliveryPartner)
router.route('/update').put(protect, updateDeliveryPartner)
router.route('/').get(protect, getDeliveryPartner)

module.exports = router
