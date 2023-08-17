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

  const axiosPrivate = useAxiosPrivate();
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

  return (
    <div>
      <h1 style={{color:"white"}}>
        {location.state.location_name} Id: {location.state.location_id}
      </h1>
      <div className='dash-content'>       
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




