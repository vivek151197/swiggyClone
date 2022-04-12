import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { OrderState } from '../../context'
import './foodsPage.css'

const FoodsPage = () => {
  const navigate = useNavigate()
  const { restaurant, orders, setOrders } = OrderState()
  const foodImage = { width: '50%' }
  const foodsList = { display: 'flex', justifyContent: 'space-between' }

  const clickHandler = (data, event) => {
    setOrders(prevOrder => {
      const find = prevOrder.find(order => order.food === data.food)
      const filter = prevOrder.filter(order => order.food !== data.food)
      if (find) {
        find.quantity += 1
        return [find, ...filter]
      }
      return [...filter, { food: data.food, quantity: 1, price: data.price }]
    })
    console.log(orders)
  }

  return (
    <div>
      <li className='foodsList'>
        {restaurant.foods.map((data, index) => {
          return (
            <div className='container' key={index}>
              <div className='food'>
                <div className='nameAndPrice'>
                  <h2>{data.food}</h2>
                  <h4>
                    {'\u20B9'}
                    {data.price}
                  </h4>
                </div>
                <img className='foodImage' src={data.pic} alt={data.food} />
              </div>
              <button
                onClick={e => clickHandler(data, e)}
                className='addToCart'
              >
                Add to Cart
              </button>
            </div>
          )
        })}
      </li>
    </div>
  )
}

export default FoodsPage
