import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangeSelector = ({ onTicketsQuery, location_id }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    
    setToDate(date);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setFromDate(today);
    setToDate(today);
    handleFormSubmit(today, today);
  };

  const handleFormSubmit = (fromDate, toDate) => {
    console.log(`IN FORM: ${location_id}`)
    if (fromDate && toDate) {
      const formattedFromDate = fromDate.toISOString().split('T')[0];
      const formattedToDate = toDate.toISOString().split('T')[0];
      onTicketsQuery(formattedFromDate, formattedToDate, location_id);
    }

  };

  return (
    <div>
      <div>Location RC Number: {location_id}</div>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit(fromDate, toDate);
      }}>
       
        <label htmlFor="from-date">From:</label>
        <DatePicker
          id="from-date"
          selected={fromDate}
          onChange={handleFromDateChange}
          dateFormat="yyyy-MM-dd"
        />

        <label htmlFor="to-date">To:</label>
        <DatePicker
          id="to-date"
          selected={toDate}
          onChange={handleToDateChange}
          dateFormat="yyyy-MM-dd"
        />

        <button type="submit">Submit</button>
        <button type="button" onClick={handleTodayClick}>Select Today</button>
      </form>
    </div>
  );
};

export default DateRangeSelector;
