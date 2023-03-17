//Style
import "./LocationList.css"
//React/components
import React, { useEffect, useState } from 'react';
import LocationCard from '../cardsnwidgets/LocationCard/LocationCard';
//State/Reduxs
import { useDispatch, useSelector } from "react-redux";
import { setrLocations } from "../../redux/locations";

//Axios
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
//Auth hook
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
    
  return (
    
    <>
        {
          //This is to not query the database again when we have locations already, will implement a reqery when we add add location feature
            locations?
              rlocations?
                 <div className='list-style'>
                   {rlocations.map((location, i)=><LocationCard key={i} props={{lname: location.location_name, loc_id: location.location_id}}/>)}
                 </div>                
                :<div className='list-style'>
                {locations.map((location, i)=><LocationCard key={i} props={{lname: location.location_name, loc_id: location.location_id}}/>)}
              </div> : <p>No Locations</p>
        }
    </>
  )
}

export default LocationList