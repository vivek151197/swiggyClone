const express = require('express')
const {
  registerRestaurant,
  authRestaurant,
  updateDetails,
  displayRestaurants
} = require('../controllers/restaurantController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerRestaurant)
router.route('/login').post(authRestaurant)
router.route('/update').post(protect, updateDetails)
router.route('/display').get(protect, displayRestaurants)

module.exports = router
