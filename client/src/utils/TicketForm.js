import React, { useState } from 'react';

const TicketForm = ({ location, creator }) => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setTicketDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index] = {
        ...newDetails[index],
        [name]: value
      };
      return newDetails;
    });
  };

  const handleAddDetail = () => {
    const newDetail = {
      material: '',
      intakeType: '',
      amount: '',
    };
    setTicketDetails((prevDetails) => [...prevDetails, newDetail]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ticket = {
      location,
      creator,
      ticketDetails,
    };
    console.log(ticket);
    setTicketDetails([]);
  };

  const handleMaterialChange = (event, index) => {
    const { value } = event.target;
    setSelectedMaterials((prevMaterials) => {
      const newMaterials = [...prevMaterials];
      newMaterials[index] = value;
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
        <label>Creator: </label>
        <input type="text" name="creator" value={creator} disabled />
      </div>

      {ticketDetails.map((detail, index) => (
        <div key={index} className="ticket-detail">
          <h3>Ticket Detail {index + 1}</h3>
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
              <option value="Glass" disabled={selectedMaterials.includes('Glass')}>
                Glass
              </option>
              <option value="Plastic" disabled={selectedMaterials.includes('Plastic')}>
                Plastic
              </option>
              <option value="Metal" disabled={selectedMaterials.includes('Metal')}>
                Metal
              </option>
            </select>
          </div>
          <div>
            <label>Intake Type: </label>
            <select
              name="intakeType"
              value={detail.intakeType}
              onChange={(e) => handleInputChange(e, index)}
            >
              <option value="SC">SC</option>
              <option value="SEG WT">SEG WT</option>
            </select>
          </div>
          <div>
            <label>Amount: </label>
            <input
              type="text"
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










