import React, { useState } from 'react'
import { OrderState } from '../../../components/Context'
import Map from '../../../components/Map'
import Header from '../Header'
import { io } from 'socket.io-client'
import './deliverystatusPage.css'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const DeliverystatusPage = () => {
  const { setOrders } = OrderState()
  const [confirmed, setConfirmed] = useState(false)
  const [picked, setPicked] = useState(false)
  const [arrived, setArrived] = useState(false)
  const [delivered, setDelivered] = useState(false)

  socket.on('orderConfirmed', () => {
    setConfirmed(true)
  })

  socket.on('orderPicked', () => {
    setPicked(true)
  })

  socket.on('orderArrived', () => {
    setArrived(true)
  })

  socket.on('orderDelivered', () => {
    setDelivered(true)
  })

  const clickHandler = () => {
    localStorage.removeItem('currentOrder')
    setOrders([])
  }

  return (
    <div>
      <Header />
      <Map />
      <div className='status'>
        <button className='statusTrue'>Order Placed</button>
        <button className={confirmed && 'statusTrue'}>Confirm Order</button>
        <button className={picked && 'statusTrue'}>Order Picked Up</button>{' '}
        <button className={arrived && 'statusTrue'}>Order Arrived</button>{' '}
        <button className={delivered && 'statusTrue'}>Order Delivered</button>
      </div>
    </div>
  )
}

export default DeliverystatusPage
