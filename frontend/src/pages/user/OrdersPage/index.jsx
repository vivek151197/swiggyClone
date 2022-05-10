import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { OrderState } from '../../../components/Context'
import Header from '../Header'
import './ordersPage.css'

const OrdersPage = () => {
  const { customer, setCustomer, orderId, setOrderId } = OrderState()
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  const getOrders = async () =>
    await fetch('/orders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${customer.token}`,
        'Content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
      })

  useEffect(() => {
    getOrders()
  }, [])

  const clickHandler = id => {
    setOrderId(id)
    localStorage.setItem('orderId', id)
    navigate('/deliveryStatus')
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
      <div className='profileContainer'>
        <b> Track Orders </b>
        <ul className='orders'>
          {orders.map((order, index) => (
            <li className='eachOrder' key={index}>
              <b> Restaurant:</b> {order.restaurant.user.name}
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
              {order.deliveryStatus !== 4 && (
                <button
                  onClick={() => clickHandler(order._id)}
                  style={{
                    background: 'green',
                    color: 'white',
                    float: 'right'
                  }}
                >
                  track Order
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OrdersPage
