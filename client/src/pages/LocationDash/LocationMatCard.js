import React, { useState } from 'react';
import "../../styles/locationdash.css";

//Axios
import axios from '../../utils/axios';

const LocationMatCard = (props) => {
    const [editingPrice, setEditingPrice] = useState(false);
    const [newPrice, setNewPrice] = useState();
    const [currentPrice, setcurrentPrice] = useState(props.price);

    //Update price
    const updatePrice = async ()=>{
        try {
            await axios.put(`location-service/${props.location_mats_id}/change_price`, {"new_price": newPrice})
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = () => {
        setEditingPrice(true);
        setNewPrice()    
    };

    const handlePriceChange = (e) => {
        setNewPrice(e.target.value);
    };

    const handleSavePrice = async () => {
        
        setEditingPrice(false);
        if (newPrice != null) {
            setcurrentPrice(newPrice);
            //Call axios to update price in db
            await updatePrice()
            setNewPrice()           
        } else {
            setEditingPrice(false)
        }
        
    };

    const handleCancel = () => {
        // Cancel editing and revert to the current price
        setEditingPrice(false);
        
    };

    return (
        <div className='location-mat-card'>
            <h3>{props.material_name}</h3>
            {editingPrice ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                        type="number"
                        value={newPrice}
                        onChange={handlePriceChange}
                    />
                    <button onClick={handleSavePrice}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>${currentPrice}</p>
                    <button onClick={handleClick}>Change Price</button>
                </div>
            )}
        </div>
    );
};

export default LocationMatCard;
