const express = require('express')
const {
  registerCustomer,
  authCustomer,
  getCustomer,
  updateCart
} = require('../controllers/customerController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerCustomer)
router.route('/login').post(authCustomer)
router.route('/cart').put(protect, updateCart)
router.route('/getCustomer').get(protect, getCustomer)

module.exports = router
