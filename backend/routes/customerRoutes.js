const express = require('express')
const {
  updateOrders,
  registerCustomer,
  authCustomer,
  updateAddress,
  updatepic,
  updatePic
} = require('../controllers/customerController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerCustomer)
router.route('/login').post(authCustomer)
router.route('/updatePic').post(protect, updatePic)
router.route('/updateAddress').post(protect, updateAddress)
router.route('/updateOrders').post(protect, updateOrders)

module.exports = router
