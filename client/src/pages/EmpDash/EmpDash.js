import React from 'react'

//style
import "./EmpDash.css"
import "../../styles/DashContent.css"
//State/Redux
import useAuth from '../../hooks/useAuth'
//Parts
import { useState } from 'react'
import {GenericDropdown, ContentDisplay} from '../../utils/DropDownPack'



export const EmpDash = () => {
  const {auth} = useAuth()

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    console.log(option)
    setSelectedOption(option);
  };

  const dropdownOptions = [
    { label: 'Create Ticket', value: 'createTicket' },
    { label: 'Make a Transaction', value: 'makeTransaction' },
    { label: 'Shipping Report', value: 'shippingReport' }
  ];

  
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
