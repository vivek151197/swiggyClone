import { createContext, useContext, useEffect, useState } from 'react'

const OrderContext = createContext()

const OrderProvider = ({ children }) => {
  const [customer, setCustomer] = useState(
    JSON.parse(localStorage.getItem('customerLogin')) || null
  )
  const [cart, setCart] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [orderId, setOrderId] = useState(
    localStorage.getItem('orderId') || null
  )

  const getCustomer = async () => {
    await fetch('/customer/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${customer.token}`,
        'Content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setCart(data.cart)
        data.cart.length && setRestaurant(data.cart[0].orderRestaurant)
      })
  }

  useEffect(() => {
    if (customer) {
      getCustomer()
    }
  }, [])

  return (
    <OrderContext.Provider
      value={{
        restaurant,
        setRestaurant,
        cart,
        setCart,
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
