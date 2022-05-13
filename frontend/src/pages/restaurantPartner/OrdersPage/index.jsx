import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { io } from 'socket.io-client'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const RestOrders = () => {
  const [restPartner, setRestPartner] = useState(
    JSON.parse(localStorage.getItem('restaurantLogin'))
  )
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    await fetch('/restaurant/orders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${restPartner.token}`,
        'Content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setOrders(data)
      })
  }

  const joinRest = async () => {
    await fetch('http://localhost:5000/restaurant/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${restPartner.token}`,
        'Content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        socket.emit('joinRest', data)
      })
  }

  useEffect(() => {
    getOrders()
    joinRest()
    socket.on('orderPlaced', () => {
      console.log('placed')
      getOrders()
    })
  }, [])

  const clickHandler = async id => {
    await fetch(`/orders/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${restPartner.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        deliveryStatus: 1
      })
    })
    getOrders()
    socket.emit('assignDeliveryPartner', id)
  }

  const deliveryStatusdisplay = deliveryStatus => {
    if (deliveryStatus === 0) return 'Order Placed'
    if (deliveryStatus === 1) return 'Order Confirmed'
    if (deliveryStatus === 2) return 'Order Picked'
    if (deliveryStatus === 3) return 'Order Arrived'
    if (deliveryStatus === 4) return 'Order Delivered Successfully'
  }

  return (
    <div>
      <Header />
      <div className='ordersContainer'>
        <b> Orders </b>
        <ul className='orders'>
          {orders.map((order, index) => (
            <li className='eachOrder' key={index}>
              <b> Customer:</b> {order.customer.name}
              <br />
              <b> Items: </b>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.food} x {item.quantity}
                  </li>
                ))}
              </ul>
              <b>Total Amount: </b>
              {'\u20B9 ' +
                order.items
                  .map(element => element.quantity * element.price)
                  .reduce((curr, acc) => acc + curr, 0)}
              <br />
              <br />
              <b>Order Status: </b>
              <span
                style={order.deliveryStatus === 4 ? { color: 'green' } : {}}
              >
                {deliveryStatusdisplay(order.deliveryStatus)}
              </span>
              <br />
              <br />
              <b>Ordered On: </b>
              {new Date(order.createdAt).toDateString()},
              {new Date(order.createdAt).toLocaleTimeString()}
              <br />
              {order.deliveryStatus === 0 && (
                <button
                  onClick={() => clickHandler(order._id)}
                  className='button'
                >
                  Confirm Order
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RestOrders
