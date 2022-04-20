import React from 'react'
import { Navigate } from 'react-router-dom'

const RestPartnerProtect = ({ Page }) => {
  const restLogin = JSON.parse(localStorage.getItem('restaurantLogin'))
  return <div>{!restLogin ? <Navigate to='/restPartner' /> : <Page />}</div>
}

export default RestPartnerProtect
