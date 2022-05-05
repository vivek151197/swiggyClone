import React, { useEffect, useState } from 'react'
import { OrderState } from '../../../components/Context'
import Map from '../../../components/Map'
import Header from '../Header'
import { io } from 'socket.io-client'
import './deliverystatusPage.css'
import OrderBox from './components/orderBox'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const DeliverystatusPage = () => {
  const { customer, orderId } = OrderState()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    ;(async () => {
      await fetch(`/orders/${orderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customer.token}`,
          'Content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setOrderData(data)
        })
    })()

    socket.emit('joinRoom', orderId)
  }, [])

  useEffect(() => {
    if (orderData && orderData.deliveryStatus === 4) {
      toast.success(`Your Order is delivered successfully`, {
        position: 'bottom-center',
        autoClose: 2000
      })
    }
  }, [orderData])

  socket.on('orderConfirmed', () => {
    console.log('confirmed')
    setOrderData(prevData => {
      prevData.deliveryStatus = 1
      return { ...prevData }
    })
  })

  socket.on('orderPicked', () => {
    console.log('picked')
    setOrderData(prevData => {
      prevData.deliveryStatus = 2
      return { ...prevData }
    })
  })

  socket.on('orderArrived', () => {
    setOrderData(prevData => {
      prevData.deliveryStatus = 3
      return { ...prevData }
    })
  })

  socket.on('orderDelivered', () => {
    setOrderData(prevData => {
      prevData.deliveryStatus = 4
      return { ...prevData }
    })
  })

  return (
    <div>
      <Header />
      <div className='mapOrder'>
        {orderData && <Map orderData={orderData} />}
        {orderData && <OrderBox orderData={orderData} />}
      </div>

      <div className='status'>
        <button className='statusTrue'>Order Placed</button>
        <button
          className={
            orderData && orderData.deliveryStatus >= 1 ? 'statusTrue' : ''
          }
        >
          Order Confirmed
        </button>
        <button
          className={
            orderData && orderData.deliveryStatus >= 2 ? 'statusTrue' : ''
          }
        >
          Order Picked Up
        </button>
        <button
          className={
            orderData && orderData.deliveryStatus >= 3 ? 'statusTrue' : ''
          }
        >
          Order Arrived
        </button>
        <button
          className={
            orderData && orderData.deliveryStatus >= 4 ? 'statusTrue' : ''
          }
        >
          Order Delivered
        </button>
      </div>
      <ToastContainer />
    </div>
  )
}

export default DeliverystatusPage
