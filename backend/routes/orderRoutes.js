const express = require('express')
const {
  createOrder,
  getOrder,
  updateOrder,
  getOrders
} = require('../controllers/orderController')
const protect = require('../middleware/authMiddleware')
const router = express.Router()

router.use(protect)

router
  .route('/')
  .post(createOrder)
  .get(getOrders)
router
  .route('/:id')
  .get(getOrder)
  .put(updateOrder)

module.exports = router
