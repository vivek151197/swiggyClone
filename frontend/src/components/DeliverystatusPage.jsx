import React from 'react'
import { OrderState } from '../context'
import MapPage from './MapPage'

const DeliverystatusPage = () => {
  const { address } = OrderState()

  return (
    <div>
      <br />
      <MapPage />
    </div>
  )
}

export default DeliverystatusPage
