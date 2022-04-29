import React, { useEffect } from 'react'
import { OrderState } from '../../../components/Context'
import Header from '../Header'
import './profilePage.css'

const ProfilePage = () => {
  const { customer, setCustomer } = OrderState()

  return (
    <div>
      <Header />
      <div className='profileContainer'>
        <span className='basicDetails'>
          <img src={customer.pic} alt={customer.name} className='profilePic' />
          <br />
          <b> {customer.name} </b>
          <br />
          <b> {customer.email}</b>
        </span>
        <b> Past Orders: </b>
        <ul className='orders'>
          {customer.orders.map(order => (
            <li className='eachOrder'>
              <b> Restaurant:</b> {order.restaurantName}
              <br />
              <b> Items: </b>
              <ul>
                {order.items.map(item => (
                  <li>
                    {item.food} x {item.quantity}
                  </li>
                ))}
              </ul>
              <b>Total Paid: </b>
              {'\u20B9 ' +
                order.items
                  .map(element => element.quantity * element.price)
                  .reduce((curr, acc) => acc + curr, 0)}
              <br />
              <br />
              <b>Order Date: </b>
              {new Date(order.updatedAt).toDateString()}
              <br />
              <b>Order Time: </b>
              {new Date(order.updatedAt).toLocaleTimeString()}
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProfilePage
