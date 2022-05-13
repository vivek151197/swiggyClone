const express = require('express')
const {
  registerCustomer,
  authCustomer,
  getCustomer,
  updateCart,
  displayRestaurants
} = require('../controllers/customerController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()
//register = /register and /getCustomer = /

router.route('/register').post(registerCustomer)
router.route('/login').post(authCustomer)
router.route('/displayRestaurants').get(protect, displayRestaurants)
router.route('/cart').put(protect, updateCart)
router.route('/').get(protect, getCustomer)

module.exports = router
