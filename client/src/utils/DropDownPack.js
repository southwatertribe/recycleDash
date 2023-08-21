import React from 'react';

//Parts
import TicketForm from './TicketForm'
import TransactionPage from '../pages/EmpDash/Parts/TransactionPage';
import ShippingReportPage from '../pages/EmpDash/Parts/ShippingReportPage';

//State/Redux
import useAuth from '../hooks/useAuth';

//Hook
import useLocationMats from '../hooks/useLocationId';



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

export const ContentDisplay = ({ selectedOption }) => {
  const {auth} = useAuth()
  const { locationMats} = useLocationMats(auth.curr_location);

  
  const getContent = () => {
    
    switch (selectedOption) {
      case 'createTicket':
        return <TicketForm maker={auth.f_name} location={auth.curr_location} location_mats={locationMats}/>
      case 'makeTransaction':
        return <TransactionPage location={auth.curr_location}/>
      case 'shippingReport':
        return <ShippingReportPage location={auth.curr_location}/>
      default:
        return <div>Please select an option</div>;
    }
  };


  

  return <div>{getContent()}</div>;
};


