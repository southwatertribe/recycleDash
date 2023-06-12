import React, { useState } from 'react';

const TicketForm = ({ location, creator, onSubmit }) => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    material: '',
    intakeType: '',
    price: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleAddDetail = () => {
    setTicketDetails((prevDetails) => [...prevDetails, newDetail]);
    setNewDetail({
      material: '',
      intakeType: '',
      price: '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ticket = {
      location,
      creator,
      ticketDetails,
    };
    onSubmit(ticket);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Ticket</h2>
      <div>
        <label>Location: </label>
        <input type="text" value={location} />
      </div>
      <div>
        <label>Creator: </label>
        <input type="text" value={creator} />
      </div>

      {ticketDetails.map((detail, index) => (
        <div key={index}>
          <h3>Ticket Detail {index + 1}</h3>
          <div>
            <label>Material: </label>
            <select name="material" value={detail.material} onChange={handleInputChange}>
              {/* {materials.map((material) => (
                  <option key={material} value={material}>{material}</option>
              ))} */}
              <option value="">Select material</option>
              <option value="Glass">Glass</option>
              <option value="Plastic">Plastic</option>
              <option value="Metal">Metal</option>
            </select>
          </div>
          <div>
            <label>Intake Type: </label>
            <input
              type="text"
              name="intakeType"
              value={detail.intakeType}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Price: </label>
            <input
              type="number"
              name="price"
              value={detail.price}
              onChange={handleInputChange}
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
