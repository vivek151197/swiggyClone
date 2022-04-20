import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import { OrderState } from '../../../../components/Context'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user, setUser } = OrderState()

  const navigate = useNavigate()

  const loginHandler = async e => {
    e.preventDefault()
    try {
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

      await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('userLogin', JSON.stringify(data))
          setUser(data)
        })

      toast.success('Login Successful', {
        position: 'bottom-center',
        autoClose: 2000
      })

      navigate('/restaurants')
    } catch (error) {
      toast.error('User doesnt exist. Please signUp', {
        position: 'bottom-center',
        autoClose: 2000
      })
    }
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
      <button type='submit' className='submit' onClick={e => loginHandler(e)}>
        Login
      </button>
      <ToastContainer />
    </form>
  )
}

export default Login
