import React, { useEffect, useState } from 'react'
import 'react-pure-modal/dist/react-pure-modal.min.css'
import { useNavigate } from 'react-router'
import { OrderState } from '../../../components/Context'
import Header from '../Header'
import './foodsPage.css'
import Modal from './modal'

const FoodsPage = () => {
  const [modal, setModal] = useState(false)
  const { restaurant, orders, setOrders } = OrderState()
  const [temp, setTemp] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!restaurant) navigate('/restaurants')
  }, [])

  const increaseHandler = data => {
    if (orders.length > 0 && orders[0].orderRestaurant._id !== restaurant._id) {
      setModal(true)
      setTemp(data)
      return
    }
    setOrders(prevOrder => {
      const find = prevOrder.find(order => order.food === data.name)
      const filter = prevOrder.filter(order => order.food !== data.name)
      if (find) {
        find.quantity += 1
        return [find, ...filter]
      }
      return [
        ...filter,
        {
          orderRestaurant: restaurant,
          food: data.name,
          quantity: 1,
          price: data.price
        }
      ]
    })
  }

  const decreaseHandler = data => {
    setOrders(prevOrder => {
      const find = prevOrder.find(order => order.food === data.name)
      const filter = prevOrder.filter(order => order.food !== data.name)
      if (find) {
        find.quantity -= 1
        if (find.quantity <= 0) return [...filter]
        return [find, ...filter]
      }
      return [...filter, { food: data.name, quantity: 1, price: data.price }]
    })
  }

  return (
    restaurant && (
      <div>
        <Header />
        <li className='foodsList'>
          {restaurant.menu.map((data, index) => {
            return (
              <div className='foodContainer' key={index}>
                <div className='food'>
                  <div className='nameAndPrice'>
                    <h2>{data.name}</h2>
                    <h4>
                      {'\u20B9'}
                      {data.price}
                    </h4>
                  </div>
                  <img className='foodImage' src={data.pic} alt={data.name} />
                </div>
                <div className='addToCart'>
                  {orders.filter(order => order.food === data.name).length &&
                  orders[0].orderRestaurant._id === restaurant._id ? (
                    <>
                      <button
                        onClick={() => decreaseHandler(data)}
                        className='decrease'
                      >
                        -
                      </button>
                      <span className='count'>
                        {
                          orders.filter(order => order.food === data.name)[0]
                            .quantity
                        }
                      </span>
                      <button
                        onClick={() => increaseHandler(data)}
                        className='increase'
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => increaseHandler(data)}
                      className='initial'
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </li>
        <Modal modal={modal} setModal={setModal} data={temp} />
      </div>
    )
  )
}

export default FoodsPage
