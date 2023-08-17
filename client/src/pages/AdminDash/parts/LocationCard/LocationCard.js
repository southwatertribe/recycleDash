//Router
import { useNavigate, Link } from "react-router-dom"
//Style
import "./LocationCard.css"
export default function LocationCard({props}){
    const navigate = useNavigate();
    const location_id = props.location_rc_number


    function handleClick() {
        
        navigate(`/location-dash/${location_id}`, {
            state: {
                location_name: props.location_name,
                location_id: location_id
            }
        })
    }
    return (
        <div className="location-card" onClick={handleClick}> 
            <div className="card-content">
                <h3>{props.location_name}</h3>
                <button>
                    Snapshot
                </button>
            </div>
        </div>
    ) 
}