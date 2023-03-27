import React from 'react'
import AddEmployeeForm from './AddEmployeeForm'
//Style
import "../AddLocationModal/AddLocationModal.css"
//Hooks
import useModal from '../../../../hooks/useModal'
const AddEmployeeModal = () => {
    const [modal, toggleModal] = useModal()
  return (
    <>
        <button onClick={toggleModal}
        className="btn.modal">
            Add An Employee
        </button>
        {modal && <div className='modal'>
            <div  className='overlay'>
                <div className='modal-content'>
                    <h3>Location Details</h3>
                    <AddEmployeeForm toggleModal={toggleModal}/>
                    <button className='close-modal' onClick={toggleModal}>
                        CLOSE
                    </button>
                </div>
            </div>
        </div>}
        
    </>
  )
}

export default AddEmployeeModal