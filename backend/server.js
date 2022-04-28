const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const restaurantRoutes = require('./routes/restaurantRoutes')
const customerRoutes = require('./routes/customerRoutes')
const deliveryPartnerRoutes = require('./routes/deliveryPartnerRoutes')
const User = require('./models/userModel')
const Restaurant = require('./models/restaurantModel')

const PORT = process.env.PORT || 5000

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/customer', customerRoutes)
app.use('/restaurant', restaurantRoutes)
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
  socket.on('joinDelivery', deliveryRoom => {
    socket.join(deliveryRoom)
  })

  socket.on('joinRoom', details => {
    socket.join(details.id)
    console.log('joined')
    socket.in('deliveryRoom').emit('orderDetails', details)

    socket.on('sendLocation', location => {
      socket.in(details.id).emit('sendLocation', location)
    })

    socket.on('orderConfirmed', () => {
      console.log('confirm')
      socket.in(details.id).emit('orderConfirmed')
    })

    socket.on('orderPicked', () => {
      console.log('pick')
      socket.in(details.id).emit('orderPicked')
    })

    socket.on('orderArrived', () => {
      console.log('arrive')
      socket.in(details.id).emit('orderArrived')
    })

    socket.on('orderDelivered', () => {
      console.log('deliver')
      socket.in(details.id).emit('orderDelivered')
    })
  })
})
