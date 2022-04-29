import React, { useEffect, useState } from 'react'
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
  const { orders, customer, mylocation } = OrderState()
  const [address, setAddress] = useState('')

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
    localStorage.removeItem('customerLogin')
    navigate('/')
  }

  return (
    <div className='userheader'>
      <button onClick={homeClickHandler} className='userhomeButton'>
        <SiSwiggy className='userhomeIcon' />
      </button>
      <h3 className='usertitle'>Swiggy Clone</h3>
      {customer ? (
        <span className='usernavigatorButtons'>
          {/* <button className='userprofileButton' onClick={profileClickHandler}>
            <CgProfile className='userprofileIcon' />
          </button> */}
          <button onClick={cartClickHandler} className='usercartButton'>
            <div style={{ backgroundColor: 'black' }}>
              <NotificationBadge count={orders.length} effect={Effect.scale} />
            </div>
            <FaShoppingCart className='usercartIcon' />
          </button>
          <button onClick={logOutHandler} className='userlogOutButton'>
            <AiOutlineLogout className='userlogOutIcon' />
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
