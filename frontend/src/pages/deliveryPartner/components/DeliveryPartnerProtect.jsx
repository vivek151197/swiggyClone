import React from 'react'
import { Navigate } from 'react-router-dom'

const DeliveryPartnerProtect = ({ Page }) => {
  const deliveryPartnerLogin = JSON.parse(
    localStorage.getItem('deliveryPartnerLogin')
  )
  return (
    <div>
      {!deliveryPartnerLogin ? <Navigate to='/delPartner' /> : <Page />}
    </div>
  )
}

export default DeliveryPartnerProtect
