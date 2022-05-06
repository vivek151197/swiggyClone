import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaShoppingCart } from 'react-icons/fa'
import { SiSwiggy } from 'react-icons/si'
import { AiOutlineLogout } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { RiEBikeFill } from 'react-icons/ri'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import './header.css'
import { OrderState } from '../../../components/Context'
import ProfileModal from './ProfileModal'

const Header = () => {
  const { cart, customer, setCustomer, mylocation } = OrderState()
  const [address, setAddress] = useState('')
  const [modal, setModal] = useState(false)

  const navigate = useNavigate()

  const homeClickHandler = () => {
    navigate('/restaurants')
  }

  const profileClickHandler = () => {
    setModal(true)
  }

  const cartClickHandler = () => {
    navigate('/cart')
  }

  const ordersClickHandler = () => {
    navigate('/order')
  }

  const logOutHandler = () => {
    localStorage.removeItem('customerLogin')
    setCustomer(null)
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
          <button className='userprofileButton' onClick={profileClickHandler}>
            <CgProfile className='userprofileIcon' />
          </button>
          <button onClick={cartClickHandler} className='usercartButton'>
            <div style={{ backgroundColor: 'black' }}>
              <NotificationBadge
                count={cart && cart.length}
                effect={Effect.scale}
              />
            </div>
            <FaShoppingCart className='usercartIcon' />
          </button>
          <button onClick={ordersClickHandler} className='userstatusButton'>
            <RiEBikeFill className='userstatusIcon' />
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
      <ProfileModal modal={modal} setModal={setModal} />
    </div>
  )
}

export default Header
