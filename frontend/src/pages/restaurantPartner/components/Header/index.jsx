import React from 'react'
import { useNavigate } from 'react-router'
import { FaShoppingCart } from 'react-icons/fa'
import { SiSwiggy } from 'react-icons/si'
import { AiOutlineLogout } from 'react-icons/ai'
import './header.css'

const Header = () => {
  const navigate = useNavigate()

  const logOutHandler = () => {
    localStorage.removeItem('restaurantLogin')
    navigate('/restPartner')
  }

  const cartClickHandler = () => {
    navigate('/restPartner/orders')
  }

  return (
    <div className='restheader'>
      <div className='resthome'>
        <SiSwiggy className='resthomeIcon' />
      </div>
      <h3 style={{ color: 'white' }}>Swiggy Restaurant Partner</h3>
      {!localStorage.getItem('restaurantLogin') ? (
        <>
          <br />
        </>
      ) : (
        <div className='restnavigatorButtons'>
          <button onClick={cartClickHandler} className='restcartButton'>
            <FaShoppingCart className='restcartIcon' />
          </button>

          <button onClick={logOutHandler} className='restlogOutButton'>
            <AiOutlineLogout className='restlogoutIcon' />
          </button>
        </div>
      )}
    </div>
  )
}

export default Header
