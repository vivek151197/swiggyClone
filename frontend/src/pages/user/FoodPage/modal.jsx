import React from 'react'
import PureModal from 'react-pure-modal'
import 'react-pure-modal/dist/react-pure-modal.min.css'
import { OrderState } from '../../../components/Context'

const Modal = ({ modal, setModal, data }) => {
  const { restaurant, cart, setCart } = OrderState()

  const yesHandler = () => {
    setCart([
      {
        food: data.name,
        quantity: 1,
        price: data.price,
        orderRestaurant: restaurant
      }
    ])
    setModal(false)
  }

  return (
    <PureModal
      header='Items already in cart'
      footer={
        <div className='modalFooter'>
          <button
            style={{
              backgroundColor: 'Red',
              color: 'white',
              flexGrow: 1,
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px'
            }}
            onClick={() => setModal(false)}
          >
            NO
          </button>
          <button
            style={{
              backgroundColor: 'Green',
              color: 'white',
              flexGrow: 1,
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px'
            }}
            onClick={() => yesHandler()}
          >
            YES
          </button>
        </div>
      }
      isOpen={modal}
      closeButton='x'
      closeButtonPosition='header'
      onClose={() => {
        setModal(false)
        return true
      }}
    >
      <p>
        Your cart contains items from other restaurant.
        <br />
        <br />
        Would you like to reset your cart for adding items from this restaurant?
      </p>
    </PureModal>
  )
}

export default Modal
