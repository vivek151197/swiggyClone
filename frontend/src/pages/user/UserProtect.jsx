import React from 'react'
import { Navigate } from 'react-router-dom'

const UserProtect = ({ Page }) => {
  const restLogin = JSON.parse(localStorage.getItem('customerLogin'))
  return <div>{!restLogin ? <Navigate to='/' /> : <Page />}</div>
}

export default UserProtect
