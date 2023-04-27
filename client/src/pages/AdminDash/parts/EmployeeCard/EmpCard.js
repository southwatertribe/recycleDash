//Router
import { useNavigate, Link } from "react-router-dom"
//Redux
import { setrLocations } from "../../../../redux/locations";
import { useSelector } from "react-redux";
//Style
import "../LocationCard/LocationCard.css"
export default function EmpCard({props}){
    const rlocations = useSelector((state)=> state.rlocations.currData)

    const navigate = useNavigate();
    const employee_id = props.employee_id

    const locationObj = rlocations.find(
        (location) => location.location_rc_number === props.curr_location
      )
    //Write name
    


    function handleClick() {
        
        // navigate(`/employee-dash/${employee_id}`, {
        //     state: {
        //         user_name: props.user_name
        //     }
        // })
        console.log(props)
    }
    return (
        <div className="location-card" onClick={handleClick}> 
            <div className="card-content">
                <h3>{props.user_name}</h3> {props.curr_location=='undefined'?<p>No Assigned location</p> : 
                    <p>Assigned Location: {locationObj.location_name}</p>}
            </div>
        </div>
    ) 
}


