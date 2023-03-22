import React, { useState } from 'react'
import { AddLocationForm } from './AddLocationForm';

//Style
import "./AddLocationModal.css"

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
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
            <div  className='overlay'>
                <div className='modal-content'>
                    <h2>Location Details</h2>
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
