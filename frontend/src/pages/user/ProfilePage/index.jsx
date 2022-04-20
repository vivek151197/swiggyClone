import React, { useEffect } from 'react'
import { OrderState } from '../../../components/Context'
import Header from '../Header'
import './profilePage.css'

const ProfilePage = () => {
  const { user, setUser } = OrderState()

  return (
    <div>
      <Header />
      <div className='profileContainer'>
        <span className='basicDetails'>
          <img src={user.pic} alt={user.name} className='profilePic' />
          <br />
          <b> {user.name} </b>
          <br />
          <b> {user.email}</b>
        </span>
        <b> Past Orders: </b>
        <ul className='orders'>
          {user.orders.map(order => (
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
