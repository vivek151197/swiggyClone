import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { OrderState } from '../../../../components/Context'
import MapForCoordinates from '../../../restaurantPartner/HomePage/MapForCoordinates'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mapShow, setMapShow] = useState(false)
  const [address, setAddress] = useState('')
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const { customer, setCustomer } = OrderState()

  const navigate = useNavigate()

  const signupHandler = async () => {
    if (!name || !email || !password || !address) {
      toast('Please enter all the fields', {
        position: 'bottom-center',
        autoClose: 2000
      })
      return
    }
    const body = {
      name: name[0].toUpperCase() + name.slice(1),
      email: email,
      password: password,
      role: 'customer',
      address: address,
      coordinates: {
        longitude: longitude,
        latitude: latitude
      }
    }

    await fetch('/customer', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error, {
            position: 'bottom-center',
            autoClose: 2000
          })
        } else {
          localStorage.setItem('customerLogin', JSON.stringify(data))
          setCustomer(data)
          toast.success('Login Successful', {
            position: 'bottom-center',
            autoClose: 2000
          })
          navigate('/restaurants')
        }
      })
  }

  return (
    <div className='loginForm'>
      <b>Name</b>
      <input
        type='text'
        className='input'
        value={name}
        onChange={e => {
          setName(e.target.value)
        }}
      />
      <b>Email</b>
      <input
        type='email'
        className='input'
        value={email}
        onChange={e => {
          setEmail(e.target.value)
        }}
      />
      <b>Password</b>
      <input
        type='password'
        className='input'
        minLength='8'
        value={password}
        onChange={e => {
          setPassword(e.target.value)
        }}
      />
      <b>Delivery location </b>
      <button onClick={() => setMapShow(true)}>Choose on map</button>
      <div
        className='mapForCoordinates'
        style={mapShow ? { display: 'block' } : { display: 'none' }}
      >
        <div className='mapContent'>
          <button className='closeMap' onClick={() => setMapShow(false)}>
            close
          </button>
          {mapShow && (
            <MapForCoordinates
              setAddress={setAddress}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setAddress={setAddress}
            />
          )}
          <button onClick={() => setMapShow(false)} className='saveCoordinates'>
            Confirm
          </button>
        </div>
      </div>
      <b>Delivery address</b>
      <input
        className='input'
        value={address}
        onChange={e => {
          setAddress(e.target.value)
        }}
      />
      <button
        type='submit'
        className='submit'
        value='Signup'
        onClick={signupHandler}
      >
        SignUp
      </button>
      <ToastContainer />
    </div>
  )
}

export default Signup
