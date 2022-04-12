import React from 'react'
import { useNavigate } from 'react-router'
import { FaShoppingCart } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { SiSwiggy } from 'react-icons/si'
import './header.css'

const Header = () => {
  const navigate = useNavigate()
  const cartClickHandler = () => {
    navigate('/cart')
  }
  const homeClickHandler = () => {
    navigate('/restaurants')
  }

  return (
    <div className='header'>
      <button onClick={homeClickHandler} className='homeButton'>
        <SiSwiggy className='homeIcon' />
      </button>
      {/* <button className='cartButton'>
        <CgProfile className='cartIcon' />
      </button> */}
      <h3 style={{ color: 'white' }}>Swiggy</h3>
      <button onClick={cartClickHandler} className='cartButton'>
        <FaShoppingCart className='cartIcon' />
      </button>
    </div>
  )
}

export default Header
