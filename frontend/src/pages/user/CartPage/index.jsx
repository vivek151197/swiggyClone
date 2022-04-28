import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { OrderState } from '../../../components/Context'
import Header from '../Header'
import './cartPage.css'

const CartPage = () => {
  const navigate = useNavigate()
  const { restaurant, orders, setOrders, customer } = OrderState()

  const deliveryCharges = 15

  const clickHandler = async () => {
    navigate('/deliverystatus')
    await fetch('/customer/updateOrders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${customer.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        restaurant: restaurant._id,
        items: orders.map(order => {
          return {
            food: order.food,
            quantity: order.quantity,
            price: order.price
          }
        })
      })
    })
      .then(res => res.json())
      .then(data =>
        setOrders(prevData => {
          prevData.orderId = data.orders[data.orders.length - 1]._id
          return prevData
        })
      )
    const localData = JSON.parse(localStorage.getItem('customerLogin'))
    localData.orders = { ...localData.orders }
    localStorage.setItem('customerLogin', JSON.stringify(localData))
    localStorage.setItem('currentOrder', JSON.stringify(orders))
  }

  return (
    <div>
      <Header />
      {orders.length !== 0 ? (
        <div className='order'>
          <div className='place'>
            <img className='restaurantImage' src={restaurant.logo} />
            <b>Restaurant : {restaurant.restaurant.name}</b>
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
          <button onClick={clickHandler} className='placeOrder'>
            Place Order
          </button>
        </div>
      ) : (
        <div className='emptyCart'>Cart is empty</div>
      )}
    </div>
  )
}
export default CartPage
