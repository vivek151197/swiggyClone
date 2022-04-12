import { createContext, useContext, useEffect, useState } from 'react'

const OrderContext = createContext()

const OrderProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState('')
  const [address, setAddress] = useState('')
  const [orders, setOrders] = useState([])
  const [mylocation, setMylocation] = useState({})

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
        setMylocation
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
