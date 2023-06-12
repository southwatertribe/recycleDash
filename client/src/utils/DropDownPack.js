import React from 'react';
import TicketForm from './sandbox'

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
  const getContent = () => {
    switch (selectedOption) {
      case 'createTicket':
        return  <TicketForm/>;
      case 'lookCashDrawer':
        return <div>Look at cash drawer</div>;
      default:
        return <div>Please select an option</div>;
    }
  };

  return <div>{getContent()}</div>;
};


