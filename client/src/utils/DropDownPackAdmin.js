import React, { useEffect, useState } from 'react';


//State/Redux
import useAuth from '../hooks/useAuth';

//Hook
import useLocationMats from '../hooks/useLocationId';

//Parts
import TicketSearch from './TicketSearch';
import LocationInfo from '../pages/LocationDash/LocationInfo';



export const GenericDropdown = ({ options, onOptionSelect }) => {

  
  const handleChange = (event) => {
    const selectedOption = event.target.value;
    onOptionSelect(selectedOption);
  };

  return (
    <select onChange={handleChange}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const ContentDisplay = ({ selectedOption, location }) => {
  const {auth} = useAuth()
  // const { locationMats} = useLocationMats(auth.curr_location);

  
  const getContent = () => {
    
    switch (selectedOption) {
      case 'ticketSearch':
        return <TicketSearch location={location}/>
      case 'viewDetails':
        return <LocationInfo location={location}/>
      default:
        return <div>Please select an option</div>;
    }
  };


  

  return <div>{getContent()}</div>;
};


