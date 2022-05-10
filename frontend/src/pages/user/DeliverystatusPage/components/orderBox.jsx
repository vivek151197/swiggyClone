import React, { useEffect } from 'react'

const OrderBox = ({ orderData }) => {
  const deliveryCharges = 15
  return (
    <div className='orderBox'>
      <div>
        <div className='place'>
          <img className='restaurantImage' src={orderData.restaurant.logo} />
          <b>Restaurant : {orderData.restaurant.user.name}</b>
        </div>
        <div className='bill'>
          <h4>Items</h4>
          {orderData.items.map((order, index) => (
            <div key={index}>
              {order.food}({order.quantity}): {order.price * order.quantity}
            </div>
          ))}
          <div className='billDetails'>
            <h4>Bill Details</h4>
            <span>
              Item Total :
              {orderData.items
                .map(order => order.price * order.quantity)
                .reduce((acc, curr) => curr + acc, 0)}
            </span>
            <span>Delivery Charges : {deliveryCharges}</span>
            <span></span>
            <b>
              Total:
              {orderData.items
                .map(order => order.price * order.quantity)
                .reduce((acc, curr) => curr + acc, 0) + deliveryCharges}
            </b>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBox
