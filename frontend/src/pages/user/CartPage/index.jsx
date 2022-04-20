import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { OrderState } from '../../../components/Context'
import Header from '../Header'
import './cartPage.css'

const CartPage = () => {
  const navigate = useNavigate()
  const { restaurant, orders, setOrders, user } = OrderState()

  const deliveryCharges = 15

  const clickHandler = async () => {
    navigate('/deliverystatus')
    await fetch('http://localhost:5000/user/updateOrders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        restaurantName: restaurant.name,
        items: orders.map(order => {
          return {
            food: order.food,
            quantity: order.quantity,
            price: order.price
          }
        }),
        deliveryStatus: 'Order Confirmed'
      })
    })
      .then(res => res.json())
      .then(data => console.log(data))

    const localData = JSON.parse(localStorage.getItem('userLogin'))

    await fetch('http://localhost:5000/user/getUser', {
      'Content-type': 'Application/json',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        localData.orders = data.orders
      })

    localStorage.setItem('userLogin', JSON.stringify(localData))
  }

  return (
    <div>
      <Header />
      {orders.length !== 0 ? (
        <div className='order'>
          <div className='place'>
            <img className='restaurantImage' src={restaurant.logo} />
            <b>Restaurant : {restaurant.name}</b>
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
