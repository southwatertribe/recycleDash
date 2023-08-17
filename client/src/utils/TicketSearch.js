import {React, useState} from 'react'

//Parts
import DateRangeSelector from './DateRangeSelelctor'

//Styles
import "../styles/locationdash.css"

//Api
import axios from './axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const TicketSearch = ({location}) => {

    const [tickets, setTickets] = useState([]);

    const axiosPrivate = useAxiosPrivate();
    
    const fetchTicketDetails = async (ticket_id) => {
        try {
        const response = await axios.get(
            `http://localhost:3001/ticket-service/${ticket_id}/details`
        )      
        return response.data
        } catch (error) {
        console.log(error)
        }
    }

    const handleTicketsQuery = async (fromDate, toDate, location_id) => {
    // Perform the query to retrieve tickets based on the date range
    // Update the `tickets` state with the retrieved tickets
    // Replace the below sample data with your actual logic
    try {
      const response = await axiosPrivate.get(
        `/ticket-service/${location_id}/get-tickets`,
        {
          headers: {'Content-Type': 'application/json'},
          params: {
            start: fromDate,
            end: toDate
          }
        }
      )
      console.log(location_id)
      console.log(response.data.tickets)
      setTickets(response.data.tickets);
    } catch (error) {
      
    }
    
  };

  
  const TicketList = ({ tickets }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    // const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const handleTicketSelect = async (ticket) => {
            
      setSelectedTicket(ticket);
      //Get details of selected ticket
      const details = await fetchTicketDetails(ticket.ticket_id)
      //add details to ticket object
      ticket["ticketDetails"] = details.ticket_details
      handleGeneratePDF(ticket);
      // setModalIsOpen(true);

    };
  
    const handleGeneratePDF = async (ticket) => {
      console.log("Generated")
      try {
        const response = await axios.post(
          'http://localhost:3001/pdf-service/generate-ticket/web-view',
          { ticket },
          { responseType: 'blob' }
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };
  
    return (
      <div>
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => handleTicketSelect(ticket)}
            // onTouchStart={(e) => {
            //   e.target.style.background = '#555';
            // }}
            // onTouchEnd={(e) => {
            //   e.target.style.background = '#333';
            // }}
            // style={{
            //   background: '#333',
            //   color: '#fff',
            //   padding: '10px',
            //   marginBottom: '10px',
            //   borderRadius: '5px',
            //   cursor: 'pointer',
            //   transition: 'background 0.3s',
            // }}
            className='location-mat-card'
          >
            <h3>Ticket Number: {ticket.sequence_num}</h3>
            <p>Date: {ticket.timestamp.substring(0, 10)}</p>
            <p>Ticket Total: ${ticket.total}</p>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div>
        <h1>Search Tickets</h1>
        <DateRangeSelector onTicketsQuery={handleTicketsQuery} location_id={location}/>
        <TicketList tickets={tickets}/>
    </div>
  )
}

export default TicketSearch