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
    try {
      const body = {
        name: name[0].toUpperCase() + name.slice(1),
        email: email,
        password: password
      }

      console.log(body)

      if (!name || !email || !password) {
        toast('Please enter all the fields', {
          position: 'bottom-center',
          autoClose: 2000
        })
        return
      }

      await fetch('/user', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(data => localStorage.setItem('userLogin', JSON.stringify(data)))

      toast.success('SignUp Successful', {
        position: 'bottom-center',
        autoClose: 2000
      })

      navigate('/restaurants')
    } catch (error) {
      console.log(error)
    }
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
      <button
        type='submit'
        className='submit'
        value='Signup'
        onClick={signupHandler}
      >
        SignUp
      </button>
      <ToastContainer />
    </form>
  )
}

export default Signup
