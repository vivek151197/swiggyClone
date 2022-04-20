const express = require('express')
const {
  registerUser,
  authUser,
  updateOrders,
  getUser
} = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(authUser)
router.route('/getUser').get(protect, getUser)
router.route('/updateOrders').post(protect, updateOrders)

module.exports = router
