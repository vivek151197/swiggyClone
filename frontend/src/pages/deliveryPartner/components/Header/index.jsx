import React from 'react'
import { useNavigate } from 'react-router'
import { SiSwiggy } from 'react-icons/si'
import { AiOutlineLogout } from 'react-icons/ai'
import './header.css'

const Header = ({ data }) => {
  const navigate = useNavigate()

  const logOutHandler = async () => {
    await fetch('http://localhost:5000/deliveryPartner/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        onlineStatus: false
      })
    })
      .then(res => res.json())
      .then(data => {})
    localStorage.removeItem('deliveryPartnerLogin')
    navigate('/deliveryPartner')
  }

  return (
    <div className='header'>
      <div className='home'>
        <SiSwiggy className='homeIcon' />
      </div>
      <h3 style={{ color: 'white' }}>Swiggy Delivery Partner</h3>
      {!localStorage.getItem('deliveryPartnerLogin') ? (
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
