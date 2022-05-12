import React, { useEffect, useState } from 'react'
import PureModal from 'react-pure-modal'
import 'react-pure-modal/dist/react-pure-modal.min.css'
import { OrderState } from '../../../components/Context'

const ProfileModal = ({ user, modal, setModal }) => {
  const { customer } = OrderState()

  // const [user, setUser] = useState('')

  // const getCustomer = async () => {
  //   await fetch('/customer/', {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${customer.token}`,
  //       'Content-type': 'application/json'
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       setUser(data)
  //     })
  // }

  // useEffect(() => {
  //   if (customer) getCustomer()
  // }, [])

  return (
    <PureModal
      header='Profile'
      isOpen={modal}
      closeButton='x'
      closeButtonPosition='header'
      onClose={() => {
        setModal(false)
        return true
      }}
      className='profileModal'
    >
      <span className='basicDetails'>
        <b> {user && user.user.name} </b>
        <b> {user && user.user.email}</b>
        {user && user.address}
      </span>
    </PureModal>
  )
}

export default ProfileModal
