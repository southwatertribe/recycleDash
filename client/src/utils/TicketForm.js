import React, { useState } from 'react';

import axios from './axios';



const TicketForm = ({ location, maker, location_mats }) => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [customer, setCustomer] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setTicketDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index] = {
        ...newDetails[index],
        [name]: value,
      };
      return newDetails;
    });
  
    if (name === 'material') {
      setSelectedMaterials((prevMaterials) => {
        const newMaterials = [...prevMaterials];
        newMaterials[index] = value;
        return newMaterials;
      });
    }
  };
  

  const handleAddDetail = () => {
    const newDetail = {
      id: ticketDetails.length + 1,
      material: '',
      intakeType: '',
      amount: '',
    };
    setTicketDetails((prevDetails) => [...prevDetails, newDetail]);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ticket = {
      location,
      maker,
      customer,
      ticketDetails,
    };
    console.log(ticket);
    
    setCustomer('')
    setTicketDetails([]);
  
    try {
      const response = await axios.post(`/ticket-service/${location}/new_ticket/`, ticket);
      console.log(response.data); // Log the response from the API
      setTicketDetails([]);
      setSelectedMaterials([]); // Reset selected materials
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleMaterialChange = (event, index) => {
    const { value } = event.target;
    setSelectedMaterials((prevMaterials) => {
      const newMaterials = [...prevMaterials];
      newMaterials[index] = value;
      return newMaterials;
    });
  };

  const handleDeleteDetail = (index) => {
    setTicketDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails.splice(index, 1);
      return newDetails;
    });
  
    setSelectedMaterials((prevMaterials) => {
      const newMaterials = [...prevMaterials];
      newMaterials.splice(index, 1);
      return newMaterials;
    });
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Ticket</h2>
      <div>
        <label>Location: </label>
        <input type="text" name="location" value={location} disabled />
      </div>
      <div>
        <label>Maker: </label>
        <input type="text" name="maker" value={maker} disabled />
      </div>
      <div>
        <label>Customer: </label>
        <input
          type="text"
          name="customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </div>

      {ticketDetails.map((detail, index) => (
        <div key={index} className="ticket-detail">
          <h3>Ticket Detail {index + 1}</h3>
          <button type="button" onClick={() => handleDeleteDetail(index)}>
            Delete Detail
          </button>
          <div>
            <label>Material: </label>
            <select
              name="material"
              value={detail.material}
              onChange={(e) => {
                handleInputChange(e, index);
                handleMaterialChange(e, index);
              }}
            >
              <option value="">Select material</option>
              {location_mats.map((material) => (
                <option
                  value={material.location_mats_id}
                  key={material.location_mats_id}
                  disabled={selectedMaterials.includes(material.location_mats_id)}
                >
                  {material.material_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Intake Type: </label>
            <select
              name="intakeType"
              value={detail.intakeType}
              onChange={(e) => handleInputChange(e, index)}
            >
              <option value="">Select Intake</option>
              <option value="SEG WT">SEG WT</option>
              <option value="SC">SC</option>
            </select>
          </div>
          <div>
            <label>Amount: </label>
            <input
              type="number"
              name="amount"
              value={detail.amount}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={handleAddDetail}>
        Add Detail
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default TicketForm;










