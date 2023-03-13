//This will be a reusable big card
import "./LocationCard.css"
export default function LocationCard({props}){
    return (
        <div className="location-card" onClick={()=>{console.log(props.loc_id)}}> 
            <div className="card-content">
                <h3>{props.lname}</h3>
            </div>
        </div>
    ) 
}