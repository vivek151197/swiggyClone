import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import OrderProvider from './context'

ReactDOM.render(
  <BrowserRouter>
    <OrderProvider>
      <App />
    </OrderProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
