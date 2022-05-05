const express = require('express')
const {
  registerRestaurant,
  authRestaurant,
  updateDetails,
  loadRestaurant,
  displayRestaurants
} = require('../controllers/restaurantController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(registerRestaurant)
router.route('/login').post(authRestaurant)
router.route('/update').put(protect, updateDetails)
router.route('/load').get(protect, loadRestaurant)
router.route('/display').get(protect, displayRestaurants)

module.exports = router
