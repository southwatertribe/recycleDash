import React, { useState } from 'react'

//Style
import "./AddLocationModal.css"

export const AddLocationModal = () => {
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)
    }
  return (
    <>
        <button onClick={toggleModal}
        className="btn.modal">
            Add A Location
        </button>

        {modal && <div className='modal'>
            <div onClick={toggleModal} className='overlay'>
                <div className='modal-content'>
                    <h2>Location Details</h2>
                    <button className='close-modal' onClick={toggleModal}>
                        CLOSE
                    </button>
                </div>
            </div>
        </div>}
    </>
  )
}
