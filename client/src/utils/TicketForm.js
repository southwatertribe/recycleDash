import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import grid from '../styles/Grids.module.css';
import container from '../styles/Layouts.module.css';
import axios from './axios';

const TicketForm = ({ location, maker, location_mats }) => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [customer, setCustomer] = useState('');
  const [cashDrawerID, setCashDrawerID] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  //Generate Shipping report function
  const genShippingReport = async(material)=>{

    try {
      const response = await axios.post(
        `report-service/${location}/${material}/generate_shipping_report`
      )      
    } catch (error) {
      console.log(error)      
    }

  }
  const fetchCashDrawer = async() => {
    try {
      const response = await axios.get(
        `/location-service/${location}/cash-drawer/`,
        {
          headers: {'Content-Type': 'application/json'},
        }
      )
      
      
      setCashDrawerID(response.data.cash_drawer_id)

    } catch (error) {
      console.log(error)      
    }
  }

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setTicketDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index] = {
        ...newDetails[index],
        [name]: value,
      };
      
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

  const ticketCDTransaction = async (total, cash_drawer) => {
    const payload = {
      "transaction_type": 'ticket',
      "amount": total
    }

    try {
      const response = await axios.put(`/location-service/${location}/${cash_drawer}/cash_drawer_transactions`, payload);
      console.log(response)
      
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
    console.log(ticket)
    // Reset State Variables
    setCustomer('');
    setTicketDetails([]);
    setSelectedMaterials([]);
    
    if (cashDrawerID === '') {
      fetchCashDrawer()
    }
    try {
      //Creating ticket
      const response = await axios.post(`/ticket-service/${location}/new_ticket/`, ticket);
      //Retrieving Total parsing to Float
      const total = parseFloat(JSON.stringify(response.data.total.total)).toFixed(2);
      //Creating a cash drawer Transaction
      ticketCDTransaction(total, cashDrawerID)
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

  const handleMaterialClick = (materialId, materialName) => {
    if (selectedMaterials.includes(materialId)) {
      return; // Material already selected, do nothing
    }

    const selectedMaterial = location_mats.find((material) => material.location_mats_id === materialId);
    if (selectedMaterial) {
      const newDetail = {
        id: ticketDetails.length + 1,
        material: selectedMaterial.location_mats_id,
        materialName: materialName,
        intakeType: "SEG WT",
        amount: '',
        mat_price: selectedMaterial.price,
        is_scrap: selectedMaterial.is_scrap
      };

      setTicketDetails((prevDetails) => [...prevDetails, newDetail]);

      setSelectedMaterials((prevMaterials) => [...prevMaterials, selectedMaterial.location_mats_id]);
    }
  };

  return (
    <div>
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
                onClick={() => handleMaterialClick(material.location_mats_id, material.material_name)}
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
      <button onClick={()=>genShippingReport("Glass")}>
      Report</button>
    </div>
    
  );
};

export default TicketForm;
