import React, { useEffect, useState } from 'react'
import Map from '../../components/Map'
import { io } from 'socket.io-client'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const DeliveryPartner = () => {
  const [deliveryPartnerLocation, setDeliveryPartnerLocation] = useState([
    77.6,
    12.9
  ])

  useEffect(() => {
    socket.emit('sendLocation', deliveryPartnerLocation)
    console.log(deliveryPartnerLocation)
  }, [deliveryPartnerLocation])

  function success (position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    setDeliveryPartnerLocation([longitude, latitude])
  }

  function error (err) {
    alert(err)
  }

  let id = ''

  useEffect(() => {
    setInterval(() => {
      id = navigator.geolocation.getCurrentPosition(success, error)
    }, 1000)
  }, [])

  return (
    <div>
      Name: Vivek
      <br />
      Location:
      {`${deliveryPartnerLocation[0]} ------ ${deliveryPartnerLocation[1]} `}
      <br />
      <button
        onClick={() => {
          console.log('Congratulations, you reached the target')
          navigator.geolocation.clearWatch(id)
        }}
      >
        clearWatch
      </button>
      <Map />
    </div>
  )
}

export default DeliveryPartner
