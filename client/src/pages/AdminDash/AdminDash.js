//Panel switch For the dash 
import React from 'react';
//tabs
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

//api
import useAuth from '../../hooks/useAuth';

//css
import "./AdminDash.css";
import "../../utils/DashContent.css";

//Components
import { AddLocationModal } from './parts/AddLocationModal/AddLocationModal';
import LocationList from './parts/LocationList/LocationList';
import EmployeeList from './parts/EmployeeList.js/EmployeeList';
import AddEmployeeModal from './parts/AddEmployeeModal/AddEmployeeModal';
export const AdminDash = () => {
    
  const {auth} = useAuth();   

  return (
    <div className='wrapper'>
      <div className='welcome'>
        <h1>Welcome {auth.email}</h1>
      </div>
        <Tabs>
          <TabList>
            <Tab>Locations</Tab>
            <Tab>Employees</Tab>
            <Tab>Tickets</Tab>
          </TabList>
              
          <TabPanel>
            <div className='dash-content'>
              <AddLocationModal/>
              <LocationList/>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='dash-content'>
              <AddEmployeeModal/>
              <EmployeeList/>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='dash-content'>
              <p>Tickets</p>
            </div>
          </TabPanel>
      </Tabs>
    </div>
  )
}
