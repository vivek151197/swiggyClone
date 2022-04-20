import React, { useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useNavigate } from 'react-router'
import 'react-tabs/style/react-tabs.css'
import Signup from './components/SignUp'
import Login from './components/Login'
import { OrderState } from '../../../components/Context'

const AuthPage = () => {
  const { user } = OrderState()
  const navigate = useNavigate()

  if (user) navigate('/restaurants')

  return (
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
  )
}

export default AuthPage
