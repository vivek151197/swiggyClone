import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Signup from '../components/Signup'
import Login from '../components/Login'
import './authPage.css'
import Header from '../components/Header'

const RestaurantPartnerAuth = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('restaurantLogin'))
      navigate('/restPartner/homePage')
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
          <Login user='user' />
        </TabPanel>
        <TabPanel className='tabPanel'>
          <Signup user='user' />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default RestaurantPartnerAuth
