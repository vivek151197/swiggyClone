import React from 'react'
import { useNavigate } from 'react-router'
import { FaShoppingCart } from 'react-icons/fa'
import { SiSwiggy } from 'react-icons/si'
import { AiOutlineLogout } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import './header.css'
import { OrderState } from '../../../components/Context'

const Header = () => {
  const { orders, user } = OrderState()

  const navigate = useNavigate()

  const homeClickHandler = () => {
    navigate('/restaurants')
  }

  const profileClickHandler = () => {
    navigate('/profile')
  }

  const cartClickHandler = () => {
    navigate('/cart')
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
      <h3 className='title'>Swiggy Clone</h3>
      {user ? (
        <span className='navigatorButtons'>
          <button className='profileButton' onClick={profileClickHandler}>
            <CgProfile className='profileIcon' />
          </button>
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
      ) : (
        <>
          <br />
        </>
      )}
    </div>
  )
}

export default Header
