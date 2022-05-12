import React, { useEffect, useState } from 'react'
import Map from '../../../components/Map'
import { io } from 'socket.io-client'
import './deliveryPartner.css'
import Header from '../components/Header'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OrderBox from '../../user/DeliverystatusPage/components/orderBox'

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
      await fetch('/deliveryPartner/', {
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

  useEffect(() => {
    if (orderData && orderData.deliveryStatus === 0) orderConfirmHandler()
  }, [orderData])

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
          longitude: longitude,
          latitude: latitude
        }
      })
    })
  }

  const error = err => {
    alert(err)
  }

  const orderConfirmHandler = async () => {
    if (orderData && orderData.deliveryStatus < 1) {
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
      setOrderData(prevData => {
        prevData.deliveryStatus = 1
        return { ...prevData }
      })
    }
  }

  const orderPickedHandler = async () => {
    socket.emit('orderPicked')
    if (orderData && orderData.deliveryStatus < 2) {
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
      setOrderData(prevData => {
        prevData.deliveryStatus = 2
        return { ...prevData }
      })
    }
  }

  const orderArrivedHandler = async () => {
    if (orderData && orderData.deliveryStatus < 3) {
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
      setOrderData(prevData => {
        prevData.deliveryStatus = 3
        return { ...prevData }
      })
    }
  }

  const orderDeliveredHandler = async () => {
    if (orderData && orderData.deliveryStatus < 4) {
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

      setOrderData(prevData => {
        prevData.deliveryStatus = 4
        return { ...prevData }
      })

      window.location.reload()
    }
  }

  return (
    <div>
      <Header data={deliveryPartner} />
      {data && (
        <div>
          <div className='nameAndLocation'>
            <span>Delivery Partner: {data.user.name}</span>
            <span>
              Location:
              {`${deliveryPartnerLocation[0]} ------ ${deliveryPartnerLocation[1]} `}
            </span>
          </div>
          <div className='statusMapcontainer'>
            <div className='statusUpdate'>
              {orderData && orderData.deliveryStatus >= 0 && (
                <button
                  onClick={orderConfirmHandler}
                  className={
                    orderData && orderData.deliveryStatus >= 1
                      ? 'delStatusTrue'
                      : ''
                  }
                >
                  Confirm Order
                </button>
              )}
              {orderData && orderData.deliveryStatus >= 1 && (
                <button
                  onClick={orderPickedHandler}
                  className={
                    orderData && orderData.deliveryStatus >= 2
                      ? 'delStatusTrue'
                      : ''
                  }
                >
                  Order Picked Up
                </button>
              )}
              {orderData && orderData.deliveryStatus >= 2 && (
                <button
                  onClick={orderArrivedHandler}
                  className={
                    orderData && orderData.deliveryStatus >= 3
                      ? 'delStatusTrue'
                      : ''
                  }
                >
                  Order Arrived
                </button>
              )}
              {orderData && orderData.deliveryStatus >= 3 && (
                <button
                  onClick={orderDeliveredHandler}
                  className={
                    orderData && orderData.deliveryStatus >= 4
                      ? 'delStatusTrue'
                      : ''
                  }
                >
                  Order Delivered
                </button>
              )}
            </div>
            <span className='mapOrder'>
              {orderData && <Map orderData={orderData} className='map' />}
              {orderData && (
                <OrderBox orderData={orderData} className='orderBox' />
              )}
            </span>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  )
}

export default DeliveryPartnerHome
