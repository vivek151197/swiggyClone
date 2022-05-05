import React, { useEffect, useState } from 'react'
import PureModal from 'react-pure-modal'
import 'react-pure-modal/dist/react-pure-modal.min.css'
import { OrderState } from '../../../components/Context'

const ProfileModal = ({ modal, setModal }) => {
  const { customer } = OrderState()

  const [user, setUser] = useState('')

  useEffect(() => {
    ;(async () =>
      await fetch('/customer/getCustomer', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customer.token}`,
          'Content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => setUser(data)))()
  }, [])

  return (
    <PureModal
      header='Profile'
      isOpen={modal}
      closeButton='close'
      closeButtonPosition='bottom'
      onClose={() => {
        setModal(false)
        return true
      }}
    >
      <span className='basicDetails'>
        <b> {user && user.customer.name} </b>
        <br />
        <b> {user && user.customer.email}</b>
        <br />
        <b> {user && user.address}</b>
      </span>
    </PureModal>
  )
}

export default ProfileModal
