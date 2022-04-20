import React from 'react'
import { OrderState } from '../../components/Context'
import Map from '../../components/Map'
import Header from './Header'

const DeliverystatusPage = () => {
  const { address } = OrderState()

  return (
    <div>
      <Header />
      <br />
      <Map />
    </div>
  )
}

export default DeliverystatusPage
