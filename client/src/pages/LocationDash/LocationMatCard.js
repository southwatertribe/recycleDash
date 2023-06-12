import React from 'react'

//Style
import "./locationdash.css"
const LocationMatCard = (props) => {
    const handleClick = async () => {
        console.log("CLICKED" + props.material_name)
    }
  return (
    <div className='location-mat-card'>
        <p>{props.location_mats_id}</p>
        <div style={{display:'flex',flexDirection:'row'}}>
            <h3>{props.material_name}</h3>
            <p>{props.price}</p>
            <button onClick={handleClick}>Change Price</button>
        </div>
       
    </div>
  )
}

export default LocationMatCard