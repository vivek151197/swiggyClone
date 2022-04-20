import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const loginHandler = async () => {
    if (!email || !password) {
      toast('Please enter all the fields', {
        position: 'bottom-center',
        autoClose: 2000
      })
      return
    }
    const body = {
      email: email,
      password: password
    }

    await fetch('http://localhost:5000/restaurant/login', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast.error('Restaurant doesnt exist. Please signUp', {
            position: 'bottom-center',
            autoClose: 2000
          })
        } else {
          localStorage.setItem('restaurantLogin', JSON.stringify(data))
          toast.success('Login Successful', {
            position: 'bottom-center',
            autoClose: 2000
          })
          navigate('/restPartner/homePage')
        }
      })
  }

  return (
    <form action='' className='loginForm'>
      <b>Email</b>
      <input
        type='email'
        className='input'
        value={email}
        onChange={e => {
          setEmail(e.target.value)
        }}
        required
      />
      <b>Password</b>
      <input
        type='password'
        className='input'
        value={password}
        onChange={e => {
          setPassword(e.target.value)
        }}
        required
      />
      <input
        type='button'
        className='submit'
        value='Login'
        onClick={loginHandler}
      />
      <ToastContainer />
    </form>
  )
}

export default Login
