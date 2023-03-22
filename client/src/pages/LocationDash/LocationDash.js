import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'

//Style 
import "../../utils/DashContent.css"
import LocationMatCard from './LocationMatCard'
const LocationDash = () => {
  let { location_id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [locationMats, getLocationMats] = useState();
  const location = useLocation();

  const fetchLocationMats = async (payload) => { //Payload is business_id
    try {
      const response = await axiosPrivate.get(
        "/location-service/location-mats",          
        {
          headers: {'Content-Type': 'application/json'},
          params: {
            location_id: location_id
          }
        }
      )
      console.log("Location Mats")
      console.log(response.data)
      getLocationMats(response.data)
      console.log(JSON.stringify(response.data))
      
    } catch (error) {
      console.log("Admin Dash Error: ")
      console.log(error)
    }
  }

  useEffect(()=> {
    fetchLocationMats()
  }, [])
  return (
    <div>
      <h1 style={{color:"white"}}>
        {location.state.location_name}
      </h1>
      <div className='dash-content'>
        <h1>Location Materials</h1>
        <>
          {
            locationMats?
              <div>
                {locationMats.map((locationMat, i)=><LocationMatCard key={i} {...{...locationMat}}/>)}  
              </div>
              : <p>Materials failed to load</p>
          }
        </>
      </div>
    </div>
  )
}

export default LocationDash



{/* <LocationMatCard key={i} props={{material_name: locationMat.material_name}}/> */}