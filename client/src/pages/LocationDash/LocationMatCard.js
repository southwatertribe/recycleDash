import React from 'react';
import "../../styles/locationdash.css";

const LocationMatCard = (props) => {
    const handleClick = async () => {
        console.log("CLICKED " + props.material_name);
    };

    return (
        <div className='location-mat-card'>
            <h3>{props.material_name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>${props.price}</p>
                <button onClick={handleClick}>Change Price</button>
            </div>
        </div>
    );
};

export default LocationMatCard;
