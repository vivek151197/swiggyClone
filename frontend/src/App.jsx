import React, { useEffect } from 'react'
import AuthPage from './pages/user/AuthPage'
import ProfilePage from './pages/user/ProfilePage'
import RestaurantsPage from './pages/user/RestaurantsPage'
import FoodsPage from './pages/user/FoodPage'
import CartPage from './pages/user/CartPage'
import DeliverystatusPage from './pages/user/DeliverystatusPage'
import { Route, Routes } from 'react-router'
import { OrderState } from './components/Context'
import './App.css'
import Auth from './pages/restaurantPartner/AuthPage'
import RestaurantPartnerHome from './pages/restaurantPartner/HomePage'
import RestPartnerProtect from './pages/restaurantPartner/components/RestProtect'
import UserProtect from './pages/user/UserProtect'

function App () {
  const { mylocation, setMylocation } = OrderState()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>
      setMylocation(position.coords)
    )
  }, [])

  return (
    <div>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route
          path='restaurants'
          element={<UserProtect Page={RestaurantsPage} />}
        />
        <Route path='foods' element={<UserProtect Page={FoodsPage} />} />
        <Route path='profile' element={<UserProtect Page={ProfilePage} />} />
        <Route path='cart' element={<UserProtect Page={CartPage} />} />
        <Route
          path='deliverystatus'
          element={<UserProtect Page={DeliverystatusPage} />}
        />
        <Route path='/restPartner/' element={<Auth />} />
        <Route
          path='/restPartner/homepage'
          element={<RestPartnerProtect Page={RestaurantPartnerHome} />}
        />
      </Routes>
    </div>
  )
}

export default App
