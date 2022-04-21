const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const restaurantRoutes = require('./routes/restaurantRoutes')
const userRoutes = require('./routes/userRoutes')

const PORT = process.env.PORT || 5000

dotenv.config()
connectDB()

const app = express()

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

app.use(cors())
app.use(express.json())

app.use('/user', userRoutes)
app.use('/restaurant', restaurantRoutes)

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
  socket.on('sendLocation', location => {
    io.emit('sendLocation', location)
  })
})
