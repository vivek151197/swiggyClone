const express = require('express')
const {
  registerDeliveryPartner,
  authDeliveryPartner,
  updateDetails,
  displayDeliveryPartners
} = require('../controllers/deliveryPartnerController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerDeliveryPartner)
router.route('/login').post(authDeliveryPartner)
router.route('/update').post(protect, updateDetails)
router.route('/display').get(protect, displayDeliveryPartners)

module.exports = router
