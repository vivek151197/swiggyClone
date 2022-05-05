const express = require('express')
const {
  createOrder,
  getOrder,
  updateOrder,
  getOrders
} = require('../controllers/orderController')
const protect = require('../middleware/authMiddleware')
const router = express.Router()

router
  .route('/')
  .post(protect, createOrder)
  .get(protect, getOrders)
router
  .route('/:id')
  .get(protect, getOrder)
  .put(protect, updateOrder)

module.exports = router
