//Router
import { useNavigate, Link } from "react-router-dom"
//Style
import "./LocationCard.css"
export default function LocationCard({props}){
    const navigate = useNavigate();
    const location_id = props.loc_id


    function handleClick() {
        
        navigate(`/location-dash/${location_id}`, {
            state: {
                lname: props.lname
            }
        })
    }
    return (
        <div className="location-card" onClick={handleClick}> 
            <div className="card-content">
                <h3>{props.lname}</h3>
            </div>
        </div>
    ) 
}