import React, { useState } from 'react'

//Styles
import grid from '../../../styles/Grids.module.css'

//Axios
import axios from '../../../utils/axios'

const ShippingReportPage = ({ location }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketNumberEnabled, setTicketNumberEnabled] = useState(false);

  // Generate Shipping report function
  const genShippingReport = async (material) => {
    try {
      const encodedMaterial = encodeURIComponent(material);
      const response = await axios.post(
        `/report-service/${location}/${encodedMaterial}/generate_shipping_report/`, {ticketNumber}
      );
      return response.data.id
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateShippingPDF = async (shipping_report_id) => {
    console.log("Generated")
    try {
      const response = await axios.post(
        `/pdf-service/${shipping_report_id}/generate_shipping_report/web_view/`,
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    setTicketNumberEnabled(true);
  };

  const handleReportButtonClick = async () => {
    if (selectedMaterial !== '') {
      const sr_id = await genShippingReport(selectedMaterial);
      if (sr_id != null) {
        handleGenerateShippingPDF(sr_id)        
      }else{
        alert(`There isnt any tickets with ${selectedMaterial} in it!`)
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        columnGap: '10%',
      }}
    >
      <div>
        <h2>Select A material</h2>
        <h3>Current Material: {selectedMaterial}</h3>
        <div className={grid.materialGrid}>
          <div
            className={grid.materialGridItem}
            onClick={() => handleMaterialClick('Glass')}
            style={{
              opacity: selectedMaterial === 'Glass' ? 1 : 0.5,
            }}
          >
            Glass
          </div>
          <div
            className={grid.materialGridItem}
            onClick={() => handleMaterialClick('Aluminum')}
            style={{
              opacity: selectedMaterial === 'Aluminum' ? 1 : 0.5,
            }}
          >
            Aluminum
          </div>
          <div
            className={grid.materialGridItem}
            onClick={() => handleMaterialClick('Plastic #1 PET')}
            style={{
              opacity: selectedMaterial === 'Plastic #1 PET' ? 1 : 0.5,
            }}
          >
            Plastic #1 PET
          </div>
          <div
            className={grid.materialGridItem}
            onClick={() => handleMaterialClick('Plastic #2 HDPE')}
            style={{
              opacity: selectedMaterial === 'Plastic #2 HDPE' ? 1 : 0.5,
            }}
          >
            Plastic #2 HDPE
          </div>
        </div>
      </div>

      <div>
        <h2>Ending Ticket</h2>
        <input
          type="number"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          disabled={!ticketNumberEnabled}
        />
      </div>
      <div>
        <h2>Submit</h2>
        <button
          onClick={handleReportButtonClick}
          disabled={!ticketNumberEnabled}
          style={{
            padding: '6px 12px', // Adjust the padding for a smaller button
            width: '120px',     // Adjust the width as needed
            display: 'block',   // Make the button a block element
            margin: '0 auto',   // Center-align the button
            fontSize: '14px',   // Adjust the font size for a smaller button
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
        >
        Report
      </button>
      </div>
    </div>
  );
}

export default ShippingReportPage;
