import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const signupHandler = async () => {
    if (!name || !email || !password) {
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
      role: 'deliveryPartner'
    }

    await fetch('/deliveryPartner/register', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (res.status === 400) {
          toast.error('User exist Please Login', {
            position: 'bottom-center',
            autoClose: 2000
          })
        }
        return res.json()
      })
      .then(data => {
        localStorage.setItem('deliveryPartnerLogin', JSON.stringify(data))
      })

    toast.success('SignUp Successful', {
      position: 'bottom-center',
      autoClose: 2000
    })

    navigate('/deliveryPartner/homePage')
  }

  return (
    <form className='loginForm' required>
      <b>Name</b>
      <input
        type='text'
        className='input'
        value={name}
        onChange={e => {
          setName(e.target.value)
        }}
        required
      />
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
        minLength='8'
        value={password}
        onChange={e => {
          setPassword(e.target.value)
        }}
        required
      />
      <input
        type='button'
        className='submit'
        value='Signup'
        onClick={signupHandler}
      />
      <ToastContainer />
    </form>
  )
}

export default Signup
