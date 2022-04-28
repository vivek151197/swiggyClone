import React, { useEffect, useState } from 'react'
import Map from '../../../components/Map'
import { io } from 'socket.io-client'
import './deliveryPartner.css'
import Header from '../components/Header'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const DeliveryPartnerHome = () => {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('deliveryPartnerLogin'))
  )

  const [deliveryPartnerLocation, setDeliveryPartnerLocation] = useState([
    77.644,
    12.9614
  ])

  useEffect(() => {
    socket.emit('sendLocation', deliveryPartnerLocation)
  }, [deliveryPartnerLocation])

  useEffect(() => {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error)
    }, 1000)

    fetch('/deliveryPartner/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        onlineStatus: true,
        coords: {
          longitude: deliveryPartnerLocation[0],
          latitude: deliveryPartnerLocation[1]
        }
      })
    })

    socket.emit('joinDelivery', 'deliveryRoom')

    socket.on('orderDetails', async details => {
      const restCoords = details.order[0].orderRestaurant.coords

      let deliveryPartners = []

      await fetch('/deliveryPartner/display', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.token}`,
          'Content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          deliveryPartners = data
        })

      const deliveryPartnersCoords = deliveryPartners.map(
        partner => partner.coords
      )

      const findMinDist = (targetCoords, arrayOfCoords) => {
        let minDist = 0
        let deliveryIndex = 0
        const findDist = (coord1, coord2) => {
          return Math.sqrt(
            ((coord1.latitude - coord2.latitude) ^ 2) -
              ((coord1.longitude - coord2.longitude) ^ 2)
          )
        }
        arrayOfCoords.forEach((coord, index) => {
          const distance = findDist(targetCoords, coord)
          minDist = distance
          if (index > 0 && minDist > distance) {
            deliveryIndex = index
          }
        })
        return deliveryIndex
      }

      const id =
        deliveryPartners[findMinDist(restCoords, deliveryPartnersCoords)]
          .deliveryPartner

      console.log(id === data.deliveryPartner._id)

      if (id === data.deliveryPartner._id) {
        socket.emit('joinRoom', details)
        await fetch('/deliveryPartner/update', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.token}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            occupied: true
          })
        })

        localStorage.setItem('currentOrder', JSON.stringify(details.order))
      }
    })
  }, [])

  useEffect(() => {
    fetch('/deliveryPartner/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        coords: {
          longitude: deliveryPartnerLocation[0],
          latitude: deliveryPartnerLocation[1]
        }
      })
    })
  }, [deliveryPartnerLocation])

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

  const orderDeliveredHandler = async () => {
    socket.emit('orderDelivered')
    await fetch('/deliveryPartner/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        occupied: false
      })
    })
    localStorage.removeItem('currentOrder')
    window.location.reload()
  }

  return (
    <div>
      <Header data={data} />
      <div className='nameAndLocation'>
        <span>Delivery Partner: {data.deliveryPartner.name}</span>
        <span>
          Location:
          {`${deliveryPartnerLocation[0]} ------ ${deliveryPartnerLocation[1]} `}
        </span>
      </div>
      <div className='statusMapcontainer'>
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
    </div>
  )
}

export default DeliveryPartnerHome
