import React, { useEffect, useState } from 'react'
import Map from '../../../components/Map'
import { io } from 'socket.io-client'
import './deliveryPartner.css'
import Header from '../components/Header'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ENDPOINT = process.env.ENDPOINT
const socket = io.connect(ENDPOINT)

const DeliveryPartnerHome = () => {
  const [deliveryPartner, setdeliveryPartner] = useState(
    JSON.parse(localStorage.getItem('deliveryPartnerLogin') || null)
  )
  const [data, setData] = useState(null)

  const [orderData, setOrderData] = useState(null)

  const [deliveryPartnerLocation, setDeliveryPartnerLocation] = useState([
    77.234,
    12.654
  ])

  useEffect(() => {
    ;(async () => {
      await fetch('/deliveryPartner/load', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${deliveryPartner.token}`,
          'Content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setData(data)
          if (data.orderAssigned) {
            ;(async () => {
              fetch(`/orders/${data.orderAssigned}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${deliveryPartner.token}`,
                  'Content-type': 'application/json'
                }
              })
                .then(res => res.json())
                .then(data => {
                  socket.emit('joinRoom', data._id)
                  setOrderData(data)
                })
            })()
          }
          socket.emit('joinOwn', data._id)
        })
    })()

    socket.on('joinRoom', async orderId => {
      console.log(orderId)
      socket.emit('joinRoom', orderId)

      await fetch(`/orders/${orderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${deliveryPartner.token}`,
          'Content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setOrderData(data)
          orderConfirmHandler()
        })

      await fetch('/deliveryPartner/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${deliveryPartner.token}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          orderAssigned: orderId,
          occupied: true
        })
      })

      toast.success(`Order recieved. Please deliver`, {
        position: 'bottom-center',
        autoClose: 2000
      })
    })

    window.interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error)
    }, 1000)
  }, [])

  const success = async position => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    setDeliveryPartnerLocation([longitude, latitude])

    socket.emit('sendLocation', {
      longitude: longitude,
      latitude: latitude
    })

    await fetch('/deliveryPartner/update', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${deliveryPartner.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        online: true,
        coordinates: {
          longitude: latitude,
          latitude: longitude
        }
      })
    })
  }

  const error = err => {
    alert(err)
  }

  const orderConfirmHandler = async () => {
    socket.emit('orderConfirmed')
    await fetch(`/orders/${orderData._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${deliveryPartner.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        deliveryStatus: 1
      })
    })
  }

  const orderPickedHandler = async () => {
    socket.emit('orderPicked')
    await fetch(`/orders/${orderData._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${deliveryPartner.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        deliveryStatus: 2
      })
    })
  }

  const orderArrivedHandler = async () => {
    socket.emit('orderArrived')
    await fetch(`/orders/${orderData._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${deliveryPartner.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        deliveryStatus: 3
      })
    })
  }

  const orderDeliveredHandler = async () => {
    socket.emit('orderDelivered')
    await fetch(`/orders/${orderData._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${deliveryPartner.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        deliveryStatus: 4
      })
    })

    await fetch('/deliveryPartner/update', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${deliveryPartner.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        occupied: false,
        orderAssigned: null
      })
    })

    window.location.reload()
  }

  return (
    <div>
      <Header data={deliveryPartner} />
      {data && (
        <div>
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
              {orderData && <Map orderData={orderData} />}
            </span>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  )
}

export default DeliveryPartnerHome

// useEffect(() => {
//   setInterval(() => {
//     navigator.geolocation.getCurrentPosition(success, error)
//   }, 1000)

//   fetch('/deliveryPartner/update', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${data.token}`,
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       onlineStatus: true,
//       coords: {
//         longitude: deliveryPartnerLocation[0],
//         latitude: deliveryPartnerLocation[1]
//       }
//     })
//   })

//   socket.emit('joinDelivery', 'deliveryRoom')

//   socket.on('orderDetails', async details => {
//     const restCoords = details.order[0].orderRestaurant.coords
//     let deliveryPartners = []

//     await fetch('/deliveryPartner/display', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${data.token}`,
//         'Content-type': 'application/json'
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         deliveryPartners = data
//       })

//     if (!deliveryPartners.length) return

//     const deliveryPartnersCoords = deliveryPartners.map(
//       partner => partner.coords
//     )

//     const findMinDist = (targetCoords, arrayOfCoords) => {
//       let minDist = 0
//       let deliveryIndex = 0
//       const findDist = (coord1, coord2) => {
//         return Math.sqrt(
//           ((coord1.latitude - coord2.latitude) ^ 2) -
//             ((coord1.longitude - coord2.longitude) ^ 2)
//         )
//       }
//       arrayOfCoords.forEach((coord, index) => {
//         const distance = findDist(targetCoords, coord)
//         minDist = distance
//         if (index > 0 && minDist > distance) {
//           deliveryIndex = index
//         }
//       })
//       return deliveryIndex
//     }

//     const id =
//       deliveryPartners[findMinDist(restCoords, deliveryPartnersCoords)]
//         .deliveryPartner

//     console.log(id === data.deliveryPartner._id)

//     if (id === data.deliveryPartner._id) {
//       socket.emit('joinRoom', details)
//       setDeliveryRoom(details)
//       await fetch('/deliveryPartner/update', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${data.token}`,
//           'Content-type': 'application/json'
//         },
//         body: JSON.stringify({
//           occupied: true
//         })
//       })

//       localStorage.setItem('currentOrder', JSON.stringify(details.order))
//       localStorage.setItem('orderId', JSON.stringify(details.id))

//       toast.success(`Order recieved. Please Confirm`, {
//         position: 'bottom-center',
//         autoClose: 2000
//       })
//     }
//   })

//   if (deliveryRoom) socket.emit('joinRoom', deliveryRoom)
// }, [])

// useEffect(() => {
//   fetch('/deliveryPartner/update', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${deliveryPartner.token}`,
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       coords: {
//         longitude: deliveryPartnerLocation[0],
//         latitude: deliveryPartnerLocation[1]
//       }
//     })
//   })
// }, [deliveryPartnerLocation])

// const success = position => {
//   const latitude = position.coords.latitude
//   const longitude = position.coords.longitude
//   setDeliveryPartnerLocation([longitude, latitude])
// }

// const error = err => {
//   alert(err)
// }

// const orderConfirmHandler = () => {
//   socket.emit('orderConfirmed')
// }

// const orderPickedHandler = () => {
//   socket.emit('orderPicked')
// }

// const orderArrivedHandler = () => {
//   socket.emit('orderArrived')
// }

// const orderDeliveredHandler = async () => {
//   socket.emit('orderDelivered')
//   await fetch('/deliveryPartner/update', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${deliveryPartner.token}`,
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       occupied: false
//     })
//   })
//   localStorage.removeItem('currentOrder')
//   localStorage.removeItem('orderId')
//   window.location.reload()
// }
