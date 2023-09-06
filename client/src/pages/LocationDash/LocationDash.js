import React, { useState } from 'react'
import { useLocation} from 'react-router-dom'

//Style 
import "../../styles/DashContent.css"

//Parts
import { GenericDropdown, ContentDisplay } from '../../utils/DropDownPackAdmin';

const LocationDash = () => {

  const location = useLocation();

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    console.log(option)
    setSelectedOption(option);
  };

  const dropdownOptions = [
    { label: 'Ticket Search', value: 'ticketSearch' },
    { label: 'View Details', value: 'viewDetails' },
    { label: 'Shipping Reports', value: 'shippingReport' },
    { label: 'Transaction Form', value: 'transactionForm'},
    { label: 'Daily Reports', value: 'daily'}
  ];

  return (
    <div>
      <h1 style={{color:"white"}}>
        {location.state.location_name} RC: {location.state.location_id}
      </h1>
      <div className='dash-content'>       
        <GenericDropdown options={dropdownOptions} onOptionSelect={handleOptionSelect} />
        <ContentDisplay selectedOption={selectedOption} location={location.state.location_id}/>
      </div>
    </div>
  )
}

export default LocationDash