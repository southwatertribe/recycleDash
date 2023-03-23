import React from 'react'

//Style 

//tabs
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

//Components
import AdminLogin from './AdminLogin';
import EmpLogin from './EmpLogin';

const LoginPage = () => {
  return (
    <Tabs>
          <TabList>
            <Tab>Admin Login</Tab>
            <Tab>Employee Login</Tab>
          </TabList>
              
          <TabPanel>
            <div className='dash-content'>
              <AdminLogin/>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='dash-content'>
              <EmpLogin/>
            </div>
          </TabPanel>
          
      </Tabs>
  )
}

export default LoginPage