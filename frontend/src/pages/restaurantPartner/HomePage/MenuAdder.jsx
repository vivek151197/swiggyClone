import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import uploadpic from './uploadpic'

const MenuAdder = ({ setMenudata }) => {
  const [name, setName] = useState('')
  const [pic, setPic] = useState('')
  const [price, setPrice] = useState('')

  const saveHandler = () => {
    if (!name || !price) {
      toast('Name and Price cannot be empty', {
        position: 'bottom-center'
      })
      return
    }
    setMenudata(prevData => [
      ...prevData,
      {
        name: name[0].toUpperCase() + name.slice(1),
        pic: pic,
        price: Number(price)
      }
    ])
    setName('')
    setPic('')
    setPrice('')
  }

  return (
    <div className='menuAdder'>
      <b className='menuAdderTitle'>MenuAdder</b>
      Item Name:
      <input type='text' value={name} onChange={e => setName(e.target.value)} />
      Photo of Item:
      <input
        type='file'
        onChange={e => uploadpic(e.target.files[0], toast, setPic)}
      />
      Price of Item:
      <input
        type='text'
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <button onClick={() => saveHandler()} className='addItem'>
        Add Item
      </button>
      <ToastContainer />
    </div>
  )
}

export default MenuAdder
