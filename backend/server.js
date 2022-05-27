const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const restaurantRoutes = require('./routes/restaurantRoutes')
const customerRoutes = require('./routes/customerRoutes')
const deliveryPartnerRoutes = require('./routes/deliveryPartnerRoutes')
const orderRoutes = require('./routes/orderRoutes')
const User = require('./models/userModel')
const { assignDelPartner } = require('./assignDelPartner')
const Order = require('./models/orderModel')
const DeliveryPartner = require('./models/deliveryPartnerModel')

const PORT = process.env.PORT || 5000

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/customer', customerRoutes)
app.use('/restaurant', restaurantRoutes)
app.use('/orders', orderRoutes)
app.use('/deliveryPartner', deliveryPartnerRoutes)

app.delete('/users', async (req, res) => {
  const del = await User.deleteMany({})
  res.status(200).json(del)
})

//--------------------Deploy--------------//
const _dirname1 = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(_dirname1, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(_dirname1, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running')
  })
}
//--------------------Deploy-------------//

const server = app.listen(
  PORT,
  console.log(`Server listening at http://localhost:${PORT}`)
)

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*'
  }
})

io.on('connection', socket => {
  socket.on('joinOwn', async id => {
    const deliveryPartner = await DeliveryPartner.findOne({ _id: id })
    if (!deliveryPartner.occupied) {
      const order = await Order.findOne({ deliveryStatus: 1 })
      if (order) {
        io.in(JSON.stringify(id)).emit('joinRoom', order._id)
      }
    }
  })

  socket.on('joinRest', rest => {
    socket.join(JSON.stringify(rest._id))
  })

  socket.on('orderPlaced', order => {
    socket.in(JSON.stringify(order.restaurant)).emit('orderPlaced', order._id)
  })

  socket.on('assignDeliveryPartner', async orderId => {
    await assignDelPartner(orderId).then(res => {
      if (res) socket.in(JSON.stringify(res)).emit('joinRoom', orderId)
    })
  })

  socket.on('joinRoom', orderId => {
    socket.join(orderId)

    socket.on('sendLocation', location => {
      io.in(orderId).emit('sendLocation', location)
    })
    socket.on('orderConfirmed', () => {
      socket.in(orderId).emit('orderConfirmed')
    })
    socket.on('orderPicked', () => {
      socket.in(orderId).emit('orderPicked')
    })
    socket.on('orderArrived', () => {
      socket.in(orderId).emit('orderArrived')
    })
    socket.on('orderDelivered', () => {
      socket.in(orderId).emit('orderDelivered')
    })
  })
})
