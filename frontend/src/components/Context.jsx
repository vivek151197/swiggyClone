import { createContext, useContext, useEffect, useState } from 'react'

const OrderContext = createContext()

const OrderProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('userLogin')) || ''
  )
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem('currentOrder')) || []
  )
  const [restaurant, setRestaurant] = useState(
    orders.length ? orders[0].orderRestaurant : ''
  )
  const [address, setAddress] = useState('')
  const [mylocation, setMylocation] = useState({
    longitude: 77.644101,
    latitude: 12.961524
  })

  return (
    <OrderContext.Provider
      value={{
        restaurant,
        setRestaurant,
        address,
        setAddress,
        orders,
        setOrders,
        mylocation,
        setMylocation,
        user,
        setUser
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const OrderState = () => {
  return useContext(OrderContext)
}

export default OrderProvider
