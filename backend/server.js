const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const router = express.Router()
const restaurantRoutes = require('./routes/restaurantRoutes')
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')

const PORT = process.env.PORT || 5000

const app = express()
dotenv.config()
connectDB()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/get', (req, res) => {
  console.log(req.body)
})

app.use('/user', userRoutes)
app.use('/restaurant', restaurantRoutes)

const server = app.listen(
  PORT,
  console.log(`Server listening at http://localhost:${PORT}`)
)
