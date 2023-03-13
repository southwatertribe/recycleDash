import React, { useEffect, useState } from 'react';
import LocationCard from './cardsnwidgets/LocationCard/LocationCard';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


const Locations = () => {
    const [locations, getLocations] = useState();
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    //Request function
    const fetchLocations = async (payload) => { //Payload is business_id
      try {
        const response = await axiosPrivate.get(
          "/get/locations", 
          {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
            params: {
              biz_id: "7f89de24-9344-469a-812d-cd3e9747d4a4"
            }
          }
        )
        getLocations(response.data)
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
    <div>
        {
            locations?
                 <div style={{display: "flex"}}>
                   {locations.map((location, i)=><LocationCard props={{lname: location.location_name, loc_id: location.location_id}}/>)}
                 </div>
                   
                 
                :<p>no locations</p>
        }
    </div>
  )
}

export default Locations