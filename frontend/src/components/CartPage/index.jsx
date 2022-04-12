import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { OrderState } from '../../context'
import './cartPage.css'

const CartPage = () => {
  const navigate = useNavigate()
  const {
    restaurant,
    food,
    address,
    setAddress,
    orders,
    setOrders
  } = OrderState()

  const deliveryCharges = 15

  const addressHandler = e => {
    setAddress(e.target.value)
  }

  const clickHandler = () => {
    navigate('/deliverystatus')
  }

  return (
    <div className='order'>
      <div className='place'>
        <img className='restaurantImage' src={restaurant.logo} />
        Restaurant : {restaurant.restaurant}
      </div>
      <div className='bill'>
        <h4>Items</h4>
        {orders.map((order, index) => (
          <div key={index}>
            {order.food}({order.quantity}): {order.price * order.quantity}
          </div>
        ))}
        <div className='billDetails'>
          <h4>Bill Details</h4>
          <span>
            Item Total :
            {orders
              .map(order => order.price * order.quantity)
              .reduce((acc, curr) => curr + acc, 0)}
          </span>
          <span>Delivery Charges : {deliveryCharges}</span>
          <span></span>
          Total:
          {orders
            .map(order => order.price * order.quantity)
            .reduce((acc, curr) => curr + acc, 0) + deliveryCharges}
        </div>
      </div>
      <button onClick={clickHandler} class='placeOrder'>
        Place Order
      </button>
    </div>
  )
}
export default CartPage
