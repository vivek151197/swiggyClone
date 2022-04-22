import React, { useEffect, useState } from 'react'
import Map from '../../components/Map'
import { io } from 'socket.io-client'
import './deliveryPartner.css'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const DeliveryPartner = () => {
  const [deliveryPartnerLocation, setDeliveryPartnerLocation] = useState([
    77.6,
    12.9
  ])

  useEffect(() => {
    socket.emit('sendLocation', deliveryPartnerLocation)
  }, [deliveryPartnerLocation])

  useEffect(() => {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error)
    }, 1000)
  }, [])

  const success = position => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    setDeliveryPartnerLocation([longitude, latitude])
  }

  const error = err => {
    alert(err)
  }

  const orderConfirmHandler = () => {
    socket.emit('orderConfirmed')
  }

  const orderPickedHandler = () => {
    socket.emit('orderPicked')
  }

  const orderArrivedHandler = () => {
    socket.emit('orderArrived')
  }

  const orderDeliveredHandler = () => {
    socket.emit('orderDelivered')
  }

  return (
    <div>
      <div className='nameAndLocation'>
        <span>Delivery Partner: Vivek(delivery) </span>
        <span>
          Location:
          {`${deliveryPartnerLocation[0]} ------ ${deliveryPartnerLocation[1]} `}
        </span>
      </div>
      <div className='statusUpdate'>
        <button onClick={orderConfirmHandler}>Confirm Order</button>
        <button onClick={orderPickedHandler}>Order Picked Up</button>
        <button onClick={orderArrivedHandler}>Order Arrived</button>
        <button onClick={orderDeliveredHandler}>Order Delivered</button>
      </div>
      <span className='map'>
        <Map />
      </span>
    </div>
  )
}

export default DeliveryPartner
