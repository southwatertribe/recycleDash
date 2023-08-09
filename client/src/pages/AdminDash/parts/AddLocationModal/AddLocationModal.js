import React, { useState } from 'react'
import { AddLocationForm } from './AddLocationForm';

//Style
import "../../../../styles/Modal.css"

//Hooks
import useModal from '../../../../hooks/useModal';
export const AddLocationModal = () => {
    const [modal, toggleModal] = useModal()

    
  return (
    <>
        <button onClick={toggleModal}
        className="btn.modal">
            Add A Location
        </button>

        {modal && <div className='modal'>
            <div  className='overlay'>
                <div className='modal-content'>
                    <h3>Location Details</h3>
                    <AddLocationForm toggleModal={toggleModal}/>
                    <button className='close-modal' onClick={toggleModal}>
                        CLOSE
                    </button>
                </div>
            </div>
        </div>}
    </>
  )
}
