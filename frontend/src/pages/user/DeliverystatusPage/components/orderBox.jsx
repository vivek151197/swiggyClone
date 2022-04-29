import React, { useEffect } from 'react'
import { OrderState } from '../../../../components/Context'

const OrderBox = () => {
  const { restaurant, orders } = OrderState()

  const deliveryCharges = 15

  return (
    <div className='orderBox'>
      <div className='place'>
        <img className='restaurantImage' src={restaurant.logo} />
        <b>Restaurant : {restaurant.restaurant.name}</b>
      </div>
      <div className='bill'>
        <h4>Items</h4>
        {orders.map((order, index) => (
          <div key={index}>
            {order.food}({order.quantity}): {order.price * order.quantity}
          </div>
        ))}
        <div className='billDetails'>
          <h4>Bill Details</h4>
          <span>
            Item Total :
            {orders
              .map(order => order.price * order.quantity)
              .reduce((acc, curr) => curr + acc, 0)}
          </span>
          <span>Delivery Charges : {deliveryCharges}</span>
          <span></span>
          <b>
            Total:
            {orders
              .map(order => order.price * order.quantity)
              .reduce((acc, curr) => curr + acc, 0) + deliveryCharges}
          </b>
        </div>
      </div>
    </div>
  )
}

export default OrderBox
