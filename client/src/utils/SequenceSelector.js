import React, { useState } from 'react'

const SequenceSelector = ({ onTicketsQuery, location_id }) => {

    const [sequenceNum, setSequenceNum] = useState(null)
    const handleFormSubmit = (sequenceNum) => {
        console.log(`IN FORM: ${sequenceNum}`)
        if (sequenceNum) {
          onTicketsQuery(sequenceNum, location_id);
    }
  };
  return (
    <div>
        <div>
            <div>Sequence Number</div>
            <form onSubmit={(e)=>{
                e.preventDefault()
                handleFormSubmit(sequenceNum)
            }}>
            <input 
                type='number'
                onChange={(e) => setSequenceNum(e.target.value)}
                >

                </input>
            <button type="submit">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default SequenceSelector