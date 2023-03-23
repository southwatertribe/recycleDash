//Router
import { useNavigate, Link } from "react-router-dom"
//Style
import "../LocationCard/LocationCard.css"
export default function EmpCard({props}){
    const navigate = useNavigate();
    const employee_id = props.employee_id


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
                <h3>{props.user_name}</h3> {props.curr_location=='undefined'?<p>No Assigned location</p> : <p>{props.curr_location}</p>}
            </div>
        </div>
    ) 
}