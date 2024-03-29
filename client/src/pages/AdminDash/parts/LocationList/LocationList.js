import React, { useEffect } from 'react';
import LocationCard from '../LocationCard/LocationCard';
//Style
import "./LocationList.css"
//State/Reduxs
import { useDispatch, useSelector } from "react-redux";
import { setrLocations } from "../../../../redux/locations";
//Requests
// import {useQuery} from "react-query";
// import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';

//Api Functions 
// import { getAllLocations } from '../../../../utils/apiCalls';



const LocationList = () => {
//Will use this in conjuction with redux
    
    // const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    //Redux
    const rlocations = useSelector((state)=> state.rlocations)
    const dispatch = useDispatch();
    
    //Request function
    //If state empty get locations <-> and if refresh trigger clocked call again
    const fetchLocations = async () => { //Payload is business_id
        
        if (rlocations.currData.length===undefined) {
          try {
            const response = await axios.get(
              `/location-service/${auth.business_id}/locations/`,          
              {
                headers: {'Content-Type': 'application/json'},
                params: {
                  business_id: auth.business_id
                }
              }
            )
            
            console.log(`Before get locations ${JSON.stringify(response.data)}`)
            
            
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
            rlocations.currData.length>0?
                 <div className='list-style'>
                   {rlocations.currData.map((location, i)=><LocationCard key={i} props={location}/>)}
                 </div>                
                :<p>no locations</p>
        }
    </>
  )
}

export default LocationList