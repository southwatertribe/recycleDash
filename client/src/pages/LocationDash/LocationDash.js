import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
//Api
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

//Style 
import "../../styles/DashContent.css"

//Parts
import LocationMatCard from './LocationMatCard'
import DateRangeSelector from '../../utils/DateRangeSelelctor'
const LocationDash = () => {
  let { location_id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [locationMats, getLocationMats] = useState();
  const [total, getCashDrawerTotal] = useState();
  const location = useLocation();

  const [tickets, setTickets] = useState([]);

  const fetchLocationMats = async () => { //Payload is business_id
    try {
      const response = await axiosPrivate.get(
        `/location-service/${location_id}/location_mats/`,          
        {
          headers: {'Content-Type': 'application/json'},
          params: {
            location_id: location_id
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
      console.log(response.data.tickets)
      setTickets(response.data.tickets);
    } catch (error) {
      
    }
    
  };


  const fetchCashDrawerTotal = async() => {
    try {
      const response = await axiosPrivate.get(
        `/location-service/${location_id}/cash_drawer/total`,
        {
          headers: {'Content-Type': 'application/json'},
        }
      )
      console.log(`cash: ${JSON.stringify(response.data)}`)
      getCashDrawerTotal(response.data.total)

    } catch (error) {
      console.log(error)      
    }
  }

  const TicketList = ({ tickets, onTicketSelect }) => {
    if (tickets.length === 0) {
      return <div>No current tickets</div>;
    }

    const handleTicketSelect = (ticketId) => {
      // Perform any desired action when a ticket is selected
      console.log(`Selected ticket ID: ${ticketId}`);
      // You can replace the console.log statement with your desired functionality
    };
  
  
    return (
      <div>
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => handleTicketSelect(ticket.ticket_id)}
            onTouchStart={(e) => {
              e.target.style.background = "#555";
            }}
            onTouchEnd={(e) => {
              e.target.style.background = "#333";
            }}
            style={{
              background: "#333",
              color: "#fff",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            <h3>Ticket Number: {ticket.sequence_num}</h3>
            <p>Date: {ticket.timestamp}</p>
            <p>Ticket Total: ${ticket.total}</p>
          </div>
        ))}
      </div>
    );
  };
  
  
  
  

  useEffect(()=> {
    fetchCashDrawerTotal()
    fetchLocationMats()
  }, [])

  return (
    <div>
      <h1 style={{color:"white"}}>
        {location.state.location_name} Id: {location.state.location_id}
      </h1>
      <div className='dash-content'>
        <div className='location-dash-row1'>
          <div className='card'>
            Card
          </div>
          <div className='card'>
            Card
          </div>
          <div className='card'>
            Card
          </div>
        </div>
        <h1>Select a Ticket</h1>
        <DateRangeSelector onTicketsQuery={handleTicketsQuery} location_id={location.state.location_id}/>
        <TicketList tickets={tickets}/>
          {/* <div className='location-dash-card'>
            <h1 className='location-dash-card-title'>Cash Drawer Balance</h1>
            <p> ${total} </p>
          </div> */}
        
        {/* <h1>Location Materials</h1>
        <>
          {
            locationMats?
              <div>
                {locationMats.map((locationMat, i)=><LocationMatCard key={i} {...{...locationMat}}/>)}  
              </div>
              : <p>Materials failed to load</p>
          }
        </> */}
      </div>
    </div>
  )
}

export default LocationDash



{/* <LocationMatCard key={i} props={{material_name: locationMat.material_name}}/> */}