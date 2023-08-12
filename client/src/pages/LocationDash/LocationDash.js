import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
//Api
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import axios from '../../utils/axios'

import Modal from 'react-modal';

//Style 
import "../../styles/DashContent.css"

//Parts
import LocationMatCard from './LocationMatCard'
import { GenericDropdown, ContentDisplay } from '../../utils/DropDownPackAdmin';

const LocationDash = () => {
  let { location_id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [locationMats, getLocationMats] = useState();
  const [total, getCashDrawerTotal] = useState();
  const location = useLocation();

  const [tickets, setTickets] = useState([]);


  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    console.log(option)
    setSelectedOption(option);
  };

  const dropdownOptions = [
    { label: 'Ticket Search', value: 'ticketSearch' },
    { label: 'View Details', value: 'viewDetails' },
  ];

  const fetchLocationMats = async () => { //Payload is business_id
    try {
      const response = await axiosPrivate.get(
        `/location-service/${location_id}/location_mats/`,          
        {
          headers: {'Content-Type': 'application/json'},
          params: {
            location_id: location_id
          }
        }
      )
      console.log("Location Mats")
      getLocationMats(response.data)
      console.log(JSON.stringify(response.data))
      
    } catch (error) {
      console.log("Admin Dash Error: ")
      console.log(error)
    }
  }


  const fetchCashDrawerTotal = async() => {
    try {
      const response = await axiosPrivate.get(
        `/location-service/${location_id}/cash_drawer/total`,
        {
          headers: {'Content-Type': 'application/json'},
        }
      )
      console.log(`cash: ${JSON.stringify(response.data)}`)
      getCashDrawerTotal(response.data.total)

    } catch (error) {
      console.log(error)      
    }
  }

  useEffect(()=> {
    fetchCashDrawerTotal()
    fetchLocationMats()
  }, [])

  return (
    <div>
      <h1 style={{color:"white"}}>
        {location.state.location_name} Id: {location.state.location_id}
      </h1>
      <div className='dash-content'>
        <h1>Select a Ticket</h1>       
        <GenericDropdown options={dropdownOptions} onOptionSelect={handleOptionSelect} />
        <ContentDisplay selectedOption={selectedOption} location={location.state.location_id}/>
          {/* <div className='location-dash-card'>
            <h1 className='location-dash-card-title'>Cash Drawer Balance</h1>
            <p> ${total} </p>
          </div> */}
        
        {/* <h1>Location Materials</h1>
        <>
          {
            locationMats?
              <div>
                {locationMats.map((locationMat, i)=><LocationMatCard key={i} {...{...locationMat}}/>)}  
              </div>
              : <p>Materials failed to load</p>
          }
        </> */}
      </div>
    </div>
  )
}

export default LocationDash



{/* <LocationMatCard key={i} props={{material_name: locationMat.material_name}}/> */}




