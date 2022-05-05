import { createContext, useContext, useEffect, useState } from 'react'

const OrderContext = createContext()

const OrderProvider = ({ children }) => {
  const [customer, setCustomer] = useState(
    JSON.parse(localStorage.getItem('customerLogin')) || ''
  )
  const [cart, setCart] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [mylocation, setMylocation] = useState(null)
  const [orderId, setOrderId] = useState(
    localStorage.getItem('orderId') || null
  )

  useEffect(() => {
    if (customer) {
      fetch('/customer/getCustomer', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customer.token}`,
          'Content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setMylocation(data.coordinates)
          setCart(data.cart)
          data.cart.length && setRestaurant(data.cart[0].orderRestaurant)
        })
    }
  }, [])

  return (
    <OrderContext.Provider
      value={{
        restaurant,
        setRestaurant,
        cart,
        setCart,
        mylocation,
        setMylocation,
        customer,
        setCustomer,
        orderId,
        setOrderId
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
