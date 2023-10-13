//Router
import { useNavigate, Link } from "react-router-dom"
//Style
import "./LocationCard.css"
import axios from "../../../../utils/axios";
import useModal from "../../../../hooks/useModal";


export default function LocationCard({props}){
    const navigate = useNavigate();
    const location_id = props.location_rc_number
    const [modal, toggleModal] = useModal()


    function handleClick() {
        
        navigate(`/location-dash/${location_id}`, {
            state: {
                location_name: props.location_name,
                location_id: location_id
            }
        })
    }

    const handleSnapshotClick = async(e) => {
        e.stopPropagation();
        try {
            const response = await axios.get(
                `/report-service/${location_id}/snapshot`
            )
            toggleModal()
        } catch (error) {
            console.log(error)            
        }
    }

    const handleModalClose = async(e) => {
        e.stopPropagation();
        toggleModal()
    }

    return (
        <div className="location-card" onClick={handleClick}> 
            <div className="card-content">
                <h3>{props.location_name}</h3>
                <button onClick={handleSnapshotClick}>
                    Snapshot
                </button>
            </div>

            {modal && <div className='modal'>
            <div  className='overlay'>
                <div className='modal-content'>
                    <h3>Location Details</h3>
                    <button className='close-modal' onClick={handleModalClose}>
                        CLOSE
                    </button>
                </div>
            </div>
        </div>}
        </div>
    ) 
}