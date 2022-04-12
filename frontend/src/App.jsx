import React, { useEffect } from 'react'
import LoginPage from './components/LoginPage'
import ProfilePage from './components/ProfilePage'
import RestaurantsPage from './components/Restaurants'
import FoodsPage from './components/FoodPage'
import CartPage from './components/CartPage'
import DeliverystatusPage from './components/DeliverystatusPage'
import { Route, Routes } from 'react-router'
import { OrderState } from './context'
import './App.css'
import Header from './components/Header/Header'

function App () {
  const { mylocation, setMylocation } = OrderState()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>
      setMylocation(position.coords)
    )
  }, [])

  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='restaurants' element={<RestaurantsPage />} />
        <Route path='foods' element={<FoodsPage />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='cart' element={<CartPage />} />
        <Route path='deliverystatus' element={<DeliverystatusPage />} />
      </Routes>
    </div>
  )
}

export default App
