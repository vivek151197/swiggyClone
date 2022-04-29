import React, { useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useNavigate } from 'react-router'
import 'react-tabs/style/react-tabs.css'
import Signup from './components/SignUp'
import Login from './components/Login'
import { OrderState } from '../../../components/Context'
import Header from '../Header'

const AuthPage = () => {
  const { customer } = OrderState()
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('customerLogin')) navigate('/restaurants')
  }, [])

  return (
    <div>
      <Header />
      <Tabs className='tabs'>
        <TabList className='tablist'>
          <Tab className='tab'>
            <b>Login</b>
          </Tab>
          <Tab className='tab'>
            <b>SignUp</b>
          </Tab>
        </TabList>

        <TabPanel className='tabPanel'>
          <Login />
        </TabPanel>
        <TabPanel className='tabPanel'>
          <Signup />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default AuthPage
