import React, { useEffect, useState } from 'react';
// import useAxiosPrivate from '../hooks/useAxiosPrivate';
//styles
import grid from '../styles/Grids.module.css';
import container from '../styles/Layouts.module.css';
import "../styles/Modal.css"
//Axios
import axios from './axios';
//Modal
import useModal from '../hooks/useModal';
//TODO OPTIMIZE FETCHING TOTALS
//TODO IMPROVE THE CASHDRAWER RENDER, SO YOU CAN USE IT ELSE WHERE
//To use the ticket form you need the location, a maker, and the location mats. 
const TicketForm = ({ location, maker, location_mats }) => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [customer, setCustomer] = useState('');
  const [cashDrawerID, setCashDrawerID] = useState('');
  const [cashDrawerTotal, setCashDrawerTotal] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [submittedTicket, setSubmittedTicket] = useState(null);


  //Modal
  const [modal, toggleModal] = useModal();
 

  useEffect(()=>{
    
    if (cashDrawerID === '') {
      fetchCashDrawer()      
    }
    fetchCashDrawerTotal()
    .then(()=>{
      console.log("Updated Cash Drawer Total:", cashDrawerTotal);
    })
    
  })

  //ASYNC Calls
  //Generate Shipping report function
  const genShippingReport = async(material)=>{

    try {
      await axios.post(
        `report-service/${location}/${material}/generate_shipping_report`
      )      
    } catch (error) {
      console.log(error)      
    }

  }
  //Fetch darawer id
  const fetchCashDrawer = async() => {

    //TODO: Optimize to not constantly pull this data in a better way

      try {
        const response = await axios.get(
          `/location-service/${location}/cash-drawer`,
          {
            headers: {'Content-Type': 'application/json'},
          }
        )
        
        setCashDrawerID(response.data.cash_drawer_id)
  
      } catch (error) {
        console.log(error)      
      }      
    
  }  
  //Fetch Drawer Total
  const fetchCashDrawerTotal = async()=>{        
    try {
      const response = await axios.get(
        `/location-service/${location}/cash_drawer/total`
      )
      const newTotal = response.data.total
      console.log("Total fetched")
      setCashDrawerTotal(newTotal)
      console.log(cashDrawerTotal)
    } catch (error) {
      console.log(error)
    }
  }
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


  //Form functions
  //Hnadle Input Change
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

  const fetchTicket = async (ticket_id) => {
    try {
      console.log(ticket_id)
      const response = await axios.get(
        `http://localhost:3001/ticket-service/${ticket_id}/get_ticket`
      )      
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTicketDetails = async (ticket_id) => {
    try {
    const response = await axios.get(
        `http://localhost:3001/ticket-service/${ticket_id}/details`
    )      
    return response.data
    } catch (error) {
    console.log(error)
    }
}


  //HandleModal
  const handleModal = async (event) => {
    event.preventDefault();
    const ticket = {
      location,
      maker,
      customer,
      ticketDetails,
    };

    setSubmittedTicket(ticket);

    //Checker for pounds
    for (let index = 0; index < ticket.ticketDetails.length; index++) {
      if (ticketDetails[index].amount >= 100) {
        if (ticketDetails[index].material_name.includes("Glass") || ticketDetails[index].amount >= 1000) {
          alert("Cannot Take In More Than 1000lbs Of Glass!")
          return;
        }
        alert("Cannot Take In More Than 100lbs Of Any Material Other Than Glass!")
        return;
      }
    }

    console.log(submittedTicket)

    toggleModal();

  }


  //Submit Ticket
  const handleSubmit = async (event) => {

    //Reset State Variables
    setCustomer('');
    setTicketDetails([]);
    setSelectedMaterials([]);

    try {
      //Creating ticket
      const response = await axios.post(`/ticket-service/${location}/new_ticket/`, submittedTicket);
      //Retrieving Total of ticketparsing to Float
      const total = parseFloat(JSON.stringify(response.data.total.total)).toFixed(2);
      const ticket_id = response.data.ticket_id
      //Creating a cash drawer Transaction
      await ticketCDTransaction(total, cashDrawerID)
      //Getting and setting new total
      await fetchCashDrawerTotal()
      //Refetch ticket
      const main = await fetchTicket(ticket_id)
      console.log(main.ticket[0])
      //Fetch details
      const details = await fetchTicketDetails(ticket_id)
      console.log(details)
      //Add Details
      main.ticket[0]["ticketDetails"] = details.ticket_details
      //Gen pdf
      handleGeneratePDF(main.ticket[0]);

    } catch (error) {
      console.error(error);
    }
    
    toggleModal()
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

  const handleGeneratePDF = async (ticket) => {
    console.log("Generated")
    try {
      const response = await axios.post(
        'http://localhost:3001/pdf-service/generate-ticket/web-view',
        { ticket },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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
        material_name: materialName,
        take_in_option: "SEG WT",
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
      <form onSubmit={handleModal}>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <div style={{marginRight: '200px'}}>
          <h2>Cash</h2>
          {cashDrawerTotal < 0 ? <div style={{color: 'red', fontSize: 20}}>-${Math.abs(cashDrawerTotal)}</div> : <div style={{color: 'green', fontSize: 20}}>$ {cashDrawerTotal}</div>}
        </div>
        <div className='create-ticket-title'>
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
        </div>
        <div style={{marginLeft: '200px'}}>
              <h2>Shipping Report</h2>
              <button onClick={()=>genShippingReport("Glass")}>
                Report
              </button>
        </div>
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
                <div>
                <p>{material.material_name}</p>
                <p>${material.price}</p>
                </div>
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
                name="take_in_option"
                value={detail.take_in_option}
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
      

      {modal && <div className='modal'>
            <div  className='overlay'>
                <div className='modal-content'>
                <h3>Ticket Details Look Good?</h3>
                {submittedTicket.ticketDetails.map((detail, index) => (
          <div key={index} className='ticket-detail'>
            <p><strong>Material:</strong> {detail.material_name}</p>
            <p><strong>Intake Type:</strong> {detail.take_in_option}</p>
            <p><strong>Amount:</strong> {detail.amount}</p>
            {/* Add other detail properties here */}
          </div>
        ))}
                    <button  onClick={handleSubmit} className='submit-button'>
                       Submit
                    </button>
                    <button onClick={toggleModal} className='go-back-button'>
                       Go Back
                    </button>
                </div>
            </div>
        </div>}
    </div>
  );
};

export default TicketForm;