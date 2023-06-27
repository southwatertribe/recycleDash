import React, { useState } from 'react';
import axios from './axios';

import grid from '../styles/Grids.module.css';
import container from '../styles/Layouts.module.css';

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
      // console.log(`MATERIAL IS: ${JSON.stringify(newDetails[0].material)}`)
      if (name === 'material') {
        const selectedMaterial = location_mats.find((material) => material.location_mats_id === value);
        if (selectedMaterial) {
          newDetails[index].mat_price = selectedMaterial.price;
        } else {
          newDetails[index].mat_price = '';
        }
      }
      return newDetails;
    });
  };

  const ticketCDTransaction = async (total) => {
    try {
      const response = await axios.post(`/${location}/:cash_drawer/cash_drawer_transactions`);
      
    } catch (error) {
      console.log(error)      
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ticket = {
      location,
      maker,
      customer,
      ticketDetails,
    };

    // Reset State Variables
    setCustomer('');
    setTicketDetails([]);
    setSelectedMaterials([]);

    try {
      const response = await axios.post(`/ticket-service/${location}/new_ticket/`, ticket);
      const total = response.data.total;
      console.log(`Total: ${JSON.stringify(total)}`)
      ticketCDTransaction(total)
    } catch (error) {
      console.error(error);
    }
  };

  const handleMaterialChange = (event, index) => {
    const { value } = event.target;
    setTicketDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index] = {
        ...newDetails[index],
        material: value,
      };
      return newDetails;
    });
  };

  const handleDeleteDetail = (index, materialId) => {
    setTicketDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails.splice(index, 1);
      return newDetails;
    });

    setSelectedMaterials((prevMaterials) => {
      const newMaterials = [...prevMaterials];
      const materialIndex = newMaterials.indexOf(materialId);
      if (materialIndex !== -1) {
        newMaterials.splice(materialIndex, 1);
      }
      return newMaterials;
    });
  };

  const handleMaterialClick = (materialId) => {
    if (selectedMaterials.includes(materialId)) {
      return; // Material already selected, do nothing
    }

    const selectedMaterial = location_mats.find((material) => material.location_mats_id === materialId);
    if (selectedMaterial) {
      const newDetail = {
        id: ticketDetails.length + 1,
        material: selectedMaterial.location_mats_id,
        intakeType: selectedMaterial.intakeType,
        amount: '',
        mat_price: selectedMaterial.price,
      };

      setTicketDetails((prevDetails) => [...prevDetails, newDetail]);

      setSelectedMaterials((prevMaterials) => [...prevMaterials, selectedMaterial.location_mats_id]);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      <h2>Create a Ticket</h2>
      <div className={container.formGroup}>
        <label>Location: </label>
        <input type="text" name="location" value={location} disabled />
      </div>
      <div className={container.formGroup}>
        <label>Maker: </label>
        <input type="text" name="maker" value={maker} disabled />
      </div>
      <div className={container.formGroup}>
        <label>Customer: </label>
        <input
          type="text"
          name="customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </div>

     <div className={container.pageContainer}>
      <div className={container.materialsContainer}>
        <div className={grid.materialGrid}>
            {location_mats.map((material) => (
              <div
                key={material.location_mats_id}
                className={`${grid.materialGridItem} ${selectedMaterials.includes(material.location_mats_id) ? grid.disabled : ''}`}
                onClick={() => handleMaterialClick(material.location_mats_id)}
              >
                {material.material_name}
              </div>
            ))}
        </div >
      </div>

      <div className={container.ticketDetailsContainer}>
        {ticketDetails.map((detail, index) => (
          <div key={index} className={grid.ticketDetail}>
            <h3>Ticket Detail {index + 1}</h3>
            <button type="button" onClick={() => handleDeleteDetail(index, detail.material)}>
              Delete Detail
            </button>
            <div className={container.formGroup}>
              <label>Material: </label>
              <select
                name="material"
                value={detail.material}
                onChange={(e) => handleMaterialChange(e, index)}
                disabled={selectedMaterials.includes(detail.material)}
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
            <div className={container.formGroup}>
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
            <div className={container.formGroup}>
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

        <button type="submit">Submit</button>        
      </div>    
      
     </div>
    </form>
  );
};

export default TicketForm;
