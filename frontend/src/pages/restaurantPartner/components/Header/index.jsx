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

  return (
    <div className='header'>
      <div className='home'>
        <SiSwiggy className='homeIcon' />
      </div>
      <h3 style={{ color: 'white' }}>Swiggy Restaurant Partner</h3>
      {!localStorage.getItem('restaurantLogin') ? (
        <>
          <br />
        </>
      ) : (
        <button onClick={logOutHandler} className='logOut'>
          <AiOutlineLogout className='logoutButton' />
        </button>
      )}
    </div>
  )
}

export default Header
