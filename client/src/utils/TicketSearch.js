import {React, useState} from 'react'

//Parts
import DateRangeSelector from './DateRangeSelelctor'
import SequenceSelector from './SequenceSelector';

//Styles
import "../styles/locationdash.css"

//Api
import axios from './axios';
// import useAxiosPrivate from '../hooks/useAxiosPrivate';

const TicketSearch = ({location}) => {

    const [tickets, setTickets] = useState([])


    const [queryOption, setQueryOption] = useState("date")
    const handleRadioChange = (event) => {
      setTickets([])
      setQueryOption(event.target.value)
    }

    // const axiosPrivate = useAxiosPrivate();
    
    const fetchTicketDetails = async (ticket_id) => {
        try {
        const response = await axios.get(
            `/ticket-service/${ticket_id}/details`
        )      
        return response.data
        } catch (error) {
        console.log(error)
        }
    }

    const handleTicketsQueryDate = async (fromDate, toDate, location_id) => {
    // Perform the query to retrieve tickets based on the date range
    // Update the `tickets` state with the retrieved tickets
    // Replace the below sample data with your actual logic
    try {
      const response = await axios.get(
        `/ticket-service/${location_id}/get-tickets`,
        {
          headers: {'Content-Type': 'application/json'},
          params: {
            start: fromDate,
            end: toDate
          }
        }
      )
      setTickets(response.data.tickets);
    } catch (error) {
      
    }
    
  }

  const handleTicketsQuerySequence = async (sequence_num, location_id)=> {
    try {
      const response = await axios.get(`/ticket-service/${location_id}/${sequence_num}/get_ticket`)
      
      setTickets(response.data.ticket)
    } catch (error) {
      
    }

  }

  
  const TicketList = ({ tickets }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    
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
          '/pdf-service/generate-ticket/web-view',
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
      !tickets.length ? 
      <div><p>There Are No Tickets</p></div> :
        <div>
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => handleTicketSelect(ticket)}
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>

      <div className="radio-group">
        <h1>Search Method</h1>
        <input
          type="radio"
          name="date_range"
          value="date"
          id="date"
          defaultChecked
          checked={queryOption === 'date'}
          onChange={handleRadioChange}
        />
        <label htmlFor="date">Date Range</label>
        <input
          type="radio"
          name="date_range"
          value="sequence"
          id="sequence"
          checked={queryOption === 'sequence'}
          onChange={handleRadioChange}
        />
        <label htmlFor="sequence">Sequence</label>
      </div>


      <div>
        <h1>Search Tickets</h1>
        {queryOption === 'date' ? (
          // Render the Date Range Selector component when 'Date Range' is selected
          <DateRangeSelector onTicketsQuery={handleTicketsQueryDate} location_id={location} />
        ) : (
          // Render the Sequence Selector component when 'Sequence' is selected
          // <SequenceSelector onTicketsQuery={handleTicketsQuerySequence} location_id={location} />
          <SequenceSelector onTicketsQuery={handleTicketsQuerySequence} location_id={location}/>
        )}
       
        <TicketList tickets={tickets}/>
      </div>


    </div>
  )
}

export default TicketSearch