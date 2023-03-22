import React from 'react';
//tabs
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

//api
import useAuth from '../../hooks/useAuth';
//import axios from '../../../utils/axios';

//css
import "./AdminDash.css"
import "../../utils/DashContent.css"
import LocationList from '../../components/LocationList/LocationList';
import TicketTab from './TicketTab/TicketTab';
import { AddLocationModal } from '../../components/cardsnwidgets/AddLocationModal/AddLocationModal';


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
            <h1>Employees</h1>
          </TabPanel>
          <TabPanel>
            <div className='dash-content'>
              <TicketTab/>
            </div>
          </TabPanel>
      </Tabs>
    </div>
  )
}
