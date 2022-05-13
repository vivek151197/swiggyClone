import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { io } from 'socket.io-client'
import { OrderState } from '../../../components/Context'
import Header from '../Header'
import './cartPage.css'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const CartPage = () => {
  const { restaurant, setRestaurant, cart, setCart, customer } = OrderState()

  const deliveryCharges = 15

  const createOrder = async () => {
    await fetch('/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${customer.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        restaurant: restaurant._id,
        items: cart.map(order => {
          return {
            food: order.food,
            quantity: order.quantity,
            price: order.price
          }
        })
      })
    })
      .then(res => res.json())
      .then(data => {
        socket.emit('orderPlaced', data)
      })
  }

  const emptyCart = async () => {
    setCart([])
    setRestaurant(null)
    await fetch('/customer/cart', {
      method: 'PUT',
      body: JSON.stringify([]),
      headers: {
        Authorization: `Bearer ${customer.token}`,
        'Content-type': 'application/json'
      }
    })
  }

  const clickHandler = () => {
    createOrder()
    emptyCart()
    toast.success(
      'Order Placed sucessfully. You can track it by clicking tracking icon in top right of the page',
      {
        position: 'bottom-center',
        autoClose: 2000
      }
    )
  }

  return (
    <div>
      <Header />
      {cart && cart.length ? (
        <div className='order'>
          <div className='place'>
            <img className='restaurantImage' src={restaurant.logo} />
            <b>Restaurant : {restaurant.user.name}</b>
          </div>
          <div className='bill'>
            <b>Items</b>
            {cart.map((order, index) => (
              <div key={index}>
                {order.food}({order.quantity}): {order.price * order.quantity}
              </div>
            ))}
            <div className='billDetails'>
              <b>Bill Details</b>
              <span>
                Item Total:
                {cart
                  .map(order => order.price * order.quantity)
                  .reduce((acc, curr) => curr + acc, 0)}
              </span>
              <span>Delivery Charges : {deliveryCharges}</span>
              <span></span>
              <b>
                Total:
                {cart
                  .map(order => order.price * order.quantity)
                  .reduce((acc, curr) => curr + acc, 0) + deliveryCharges}
              </b>
            </div>
          </div>
          {
            <button onClick={clickHandler} className='placeOrder'>
              Place Order
            </button>
          }
        </div>
      ) : (
        <div className='emptyCart'>Cart is empty</div>
      )}
      <ToastContainer />
    </div>
  )
}
export default CartPage
