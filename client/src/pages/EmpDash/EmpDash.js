import React from 'react'
import { useEffect } from 'react'

//style
import "./EmpDash.css"
import "../../utils/DashContent.css"
//State/Redux
import useAuth from '../../hooks/useAuth'
//Parts
import { useState } from 'react'
import {GenericDropdown, ContentDisplay} from '../../utils/DropDownPack'
//axios
import useAxiosPrivate from '../../hooks/useAxiosPrivate'


export const EmpDash = () => {
  const {auth} = useAuth()
  const axiosPrivate = useAxiosPrivate();
  const [locationMats, getLocationMats] = useState();
  // const { locationMats, fetchLocationMats} = useLocationData(auth.curr_location);

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    console.log(option)
    setSelectedOption(option);
  };

  const fetchLocationMats = async () => { //Payload is business_id
    try {
      const response = await axiosPrivate.get(
        `/location-service/${auth.curr_location}/location_mats/`,          
        {
          headers: {'Content-Type': 'application/json'},
          params: {
            location_id: auth.curr_location
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

  const dropdownOptions = [
    { label: 'Create Ticket', value: 'createTicket' },
    { label: 'Look at Cash Drawer', value: 'lookCashDrawer' },
  ];

  useEffect(()=> {
    fetchLocationMats()
  }, [])
  return (
    <div className='wrapper'>
      <div className='welcome'>
        <div>Welcome {auth.f_name} </div>
        <div>Your current location is: {auth.curr_location}</div>
        <ContentDisplay selectedOption={selectedOption}/>
       <GenericDropdown options={dropdownOptions} onOptionSelect={handleOptionSelect}/>
      </div>
    </div>
  )
}
