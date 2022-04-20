import React from 'react'
import { useNavigate } from 'react-router'
import { FaShoppingCart } from 'react-icons/fa'
import { SiSwiggy } from 'react-icons/si'
import { AiOutlineLogout } from 'react-icons/ai'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import './header.css'
import { OrderState } from '../../../components/Context'

const Header = () => {
  const { orders } = OrderState()

  const navigate = useNavigate()
  const cartClickHandler = () => {
    navigate('/cart')
  }
  const homeClickHandler = () => {
    navigate('/restaurants')
  }

  const logOutHandler = () => {
    localStorage.removeItem('userLogin')
    navigate('/')
  }

  return (
    <div className='header'>
      <button onClick={homeClickHandler} className='homeButton'>
        <SiSwiggy className='homeIcon' />
      </button>
      <h3 style={{ color: 'white' }}>Swiggy</h3>
      <span className='cartAndLogout'>
        <button onClick={cartClickHandler} className='cartButton'>
          <div style={{ backgroundColor: 'black' }}>
            <NotificationBadge count={orders.length} effect={Effect.scale} />
          </div>

          <FaShoppingCart className='cartIcon' />
        </button>
        <button onClick={logOutHandler} className='logOutButton'>
          <AiOutlineLogout className='logOutIcon' />
        </button>
      </span>
    </div>
  )
}

export default Header
