import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { OrderState } from '../../context'
import restaurants from '../../data/data.json'
import './restaurantsPage.css'

const RestaurantsPage = () => {
  const navigate = useNavigate()
  const { restaurant, setRestaurant } = OrderState()

  const clickHandler = restaurantData => {
    setRestaurant(restaurantData)
    navigate('/foods')
  }

  return (
    <div>
      <li className='restaurantsList'>
        {restaurants.map((data, index) => {
          return (
            <div
              key={index}
              className='restaurant'
              onClick={() => clickHandler(data)}
            >
              <img className='restaurantImage' src={data.logo} />
              <h4>{data.restaurant}</h4>
            </div>
          )
        })}
      </li>
    </div>
  )
}

export default RestaurantsPage
