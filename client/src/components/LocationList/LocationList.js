import React, { useEffect, useState } from 'react';
import LocationCard from '../cardsnwidgets/LocationCard/LocationCard';
//Style
import "./LocationList.css"
// import axios from '../../utils/axios';
import axios from '../../utils/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';



const LocationList = () => {
    const [locations, getLocations] = useState();
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    
    //Request function
    const fetchLocations = async (payload) => { //Payload is business_id
      try {
        const response = await axiosPrivate.get(
          "/location-service/locations",          
          {
            headers: {'Content-Type': 'application/json'},
            params: {
              biz_id: auth.business_id
            }
          }
        )
        getLocations(response.data)
        localStorage.setItem("locations", JSON.stringify(response.data))
        console.log(JSON.stringify(response.data))
        
      } catch (error) {
        console.log("Admin Dash Error: ")
        console.log(error)
      }
    }
  
    const data = {biz_id: "7f89de24-9344-469a-812d-cd3e9747d4a4"}
  
    useEffect(()=> {
      fetchLocations(data)
    }, [])
    console.log(locations)
  return (
    <>
        {
            locations?
                 <div className='list-style'>
                   {locations.map((location, i)=><LocationCard key={i} props={{lname: location.location_name, loc_id: location.location_id}}/>)}
                 </div>                
                :<p>no locations</p>
        }
    </>
  )
}

export default LocationList