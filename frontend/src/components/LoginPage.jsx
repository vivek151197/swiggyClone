import React from 'react'
import { useNavigate } from 'react-router'

const LoginPage = () => {
  const navigate = useNavigate()
  const clickHandler = () => {
    navigate('/restaurants')
  }
  return (
    <div>
      <button onClick={clickHandler}>Login</button>
    </div>
  )
}

export default LoginPage
