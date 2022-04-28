import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import './homePage.css'
import uploadpic from './uploadpic'
import { ToastContainer, toast } from 'react-toastify'
import Header from '../components/Header'
import MenuAdder from './MenuAdder'
import MapForCoordinates from './MapForCoordinates'

const RestaurantPartnerHome = () => {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('restaurantLogin'))
  )
  const [name, setName] = useState(data.restaurant.name)
  const [address, setAddress] = useState(data.address)
  const [latitude, setLatitude] = useState(
    data.coords ? data.coords.latitude : ''
  )
  const [longitude, setLongitude] = useState(
    data.coords ? data.coords.longitude : ''
  )
  const [logo, setLogo] = useState(data.logo)
  const [menudata, setMenudata] = useState(data.menu)
  const [mapShow, setMapShow] = useState(false)

  console.log(data)
  const saveHandler = async () => {
    if (!name || !address || !latitude || !longitude) {
      toast.error('Name, Address and coordinates cannot be empty', {
        position: 'bottom-center'
      })
      return
    }
    const body = {
      name: name,
      address: address,
      coords: { latitude: Number(latitude), longitude: Number(longitude) },
      logo: logo,
      menu: menudata
    }
    try {
      await fetch('http://localhost:5000/restaurant/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.token}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(data => console.log(data))

      toast.success('Changes saved succesfully', { position: 'bottom-center' })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteItem = key => {
    setMenudata(prevdata => {
      return prevdata.filter((data, index) => key !== index)
    })
  }

  return (
    <div>
      <Header />
      <div className='details'>
        <div className='container'>
          <b>Name</b>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='This Name will be displayed to the customers'
          />
          <b>Location:</b>
          <ul className='coordinates'>
            <button onClick={() => setMapShow(true)}>Choose on map</button>
            <b> Longitude:</b>
            <input type='text' value={longitude} readOnly />
            <b> Latitude:</b>
            <input type='text' value={latitude} readOnly />
            <div
              className='mapForCoordinates'
              style={mapShow ? { display: 'block' } : { display: 'none' }}
            >
              <div className='mapContent'>
                <button className='closeMap' onClick={() => setMapShow(false)}>
                  close
                </button>
                {mapShow && (
                  <MapForCoordinates
                    setAddress={setAddress}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                    latitude={latitude}
                    longitude={longitude}
                    setAddress={setAddress}
                  />
                )}
                <button
                  onClick={() => setMapShow(false)}
                  className='saveCoordinates'
                >
                  Save
                </button>
              </div>
            </div>
            <br />
          </ul>
          <b>Address:</b>
          <input
            type='text'
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <b>Logo:</b>
          <input
            type='file'
            onChange={event => {
              event.preventDefault()
              uploadpic(event.target.files[0], toast, setLogo)
            }}
          />
          <ToastContainer />
        </div>

        <MenuAdder setMenudata={setMenudata} />

        <div className='menu'>
          <b>Menu:</b>
          <ul className='itemList'>
            {menudata.length === 0 ? (
              <span>
                No food Items added yet.
                <br />
                Please add atleast one item to have your restaurant diplayed to
                the customers.
              </span>
            ) : (
              ''
            )}
            {menudata.map((item, index) => (
              <div className='foodItem' key={index}>
                <span>
                  <b> ItemName:</b> {item.name}
                </span>
                <span>
                  <b>Price of Item:</b> {item.price}
                </span>
                <span className='photo'>
                  <b>Photo of Item:</b>
                  <img src={item.pic} alt={item.name} className='foodPhoto' />
                </span>
                <button
                  onClick={() => deleteItem(index)}
                  className='deleteItem'
                >
                  Delete Item
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <button
        className='confirm'
        onClick={e => {
          saveHandler()
        }}
      >
        Save and Confirm
      </button>
    </div>
  )
}

export default RestaurantPartnerHome
