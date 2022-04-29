import React, { useEffect, useState } from 'react'
import { OrderState } from '../../../components/Context'
import Map from '../../../components/Map'
import Header from '../Header'
import { io } from 'socket.io-client'
import './deliverystatusPage.css'
import OrderBox from './components/orderBox'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const DeliverystatusPage = () => {
  const { orders, setOrders, setRestaurant, customer } = OrderState()
  const [confirmed, setConfirmed] = useState(false)
  const [picked, setPicked] = useState(false)
  const [arrived, setArrived] = useState(false)
  const [delivered, setDelivered] = useState(false)
  const [room, setRoom] = useState({ id: customer.customer, order: orders })

  useEffect(() => {
    const details = {
      id: customer.customer,
      order: orders
    }
    setRoom(details)
    socket.emit('joinRoom', details)
  }, [])

  socket.on('orderConfirmed', () => {
    setConfirmed(true)
  })

  socket.on('orderPicked', input => {
    setPicked(true)
  })

  socket.on('orderArrived', () => {
    setArrived(true)
  })

  socket.on('orderDelivered', () => {
    setDelivered(true)
    localStorage.removeItem('currentOrder')
    setOrders([])
    setRestaurant('')
  })

  return (
    <div>
      <Header />
      <div className='mapOrder'>
        <Map room={room} />
        <OrderBox />
      </div>

      <div className='status'>
        <button className='statusTrue'>Order Placed</button>
        <button className={confirmed ? 'statusTrue' : ''}>Confirm Order</button>
        <button className={picked ? 'statusTrue' : ''}>Order Picked Up</button>
        <button className={arrived ? 'statusTrue' : ''}>Order Arrived</button>
        <button className={delivered ? 'statusTrue' : ''}>
          Order Delivered
        </button>
      </div>
    </div>
  )
}

export default DeliverystatusPage
