import React from 'react'

//Style 

//tabs
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

//Components
import AdminLogin from '../../parts/logins/AdminLogin';
import EmpLogin from '../../parts/logins/EmpLogin';

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