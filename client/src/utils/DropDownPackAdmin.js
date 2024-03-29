import React from 'react';


//Style
import dropdown from '../styles/Dropdown.module.css'



//Parts
import TicketSearch from './TicketSearch';
import LocationInfo from '../pages/LocationDash/LocationInfo';
import ShippingReportPage from '../pages/EmpDash/Parts/ShippingReportPage';
import TransactionPage from './TransactionPage';



export const GenericDropdown = ({ options, onOptionSelect }) => {

  
  const handleChange = (event) => {
    const selectedOption = event.target.value;
    onOptionSelect(selectedOption);
  };

  return (
    <select onChange={handleChange}
      className={dropdown.selectWrapper}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className={dropdown.selectDropdown}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const ContentDisplay = ({ selectedOption, location }) => {


  
  const getContent = () => {
    
    switch (selectedOption) {
      case 'ticketSearch':
        return <TicketSearch location={location}/>
      case 'viewDetails':
        return <LocationInfo location={location}/>
      case 'shippingReport':
        return <ShippingReportPage location={location}/>
      case 'transactionForm':
        return <TransactionPage location={location}/>
      case 'dailyReports':
        return <p>Daily Summaries</p>
      default:
        return <div>Please select an option</div>;
    }
  };


  

  return <div>{getContent()}</div>;
};


