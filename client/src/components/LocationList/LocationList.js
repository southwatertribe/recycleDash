import React, { useEffect, useState } from 'react';
import LocationCard from '../cardsnwidgets/LocationCard/LocationCard';
//Style
import "./LocationList.css"
//State/Reduxs
import { useDispatch, useSelector } from "react-redux";
import { setrLocations } from "../../redux/locations";
// import axios from '../../utils/axios';
import axios from '../../utils/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';



const LocationList = () => {
//Will use this in conjuction with redux
    const [locations, getLocations] = useState();
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    //Redux
    const rlocations = useSelector((state)=> state.rlocations.currData)
    const dispatch = useDispatch();
    
    //Request function
    //If state empty get locations <-> and if refresh trigger clocked call again
    const fetchLocations = async () => { //Payload is business_id
      if (rlocations.length!=0) {
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
          console.log(`Before get locations ${JSON.stringify(response.data)}`)
          getLocations(response.data)
          
          dispatch(setrLocations(response.data))
                   
          
        } catch (error) {
          console.log("Admin Dash Error: ")
          console.log(error)
        }
      }
      
    }
  
    
    //On render
    useEffect(()=> {
      
      fetchLocations()
      
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