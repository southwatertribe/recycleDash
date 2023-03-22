import useAxiosPrivate from "../hooks/useAxiosPrivate"
import useAuth from "../hooks/useAuth"
const axiosPrivate = useAxiosPrivate();
const {auth} = useAuth();
//Fetch all locations
export const getAllLocations = async (business_id)=>{
    
    
    const response = await axiosPrivate.get(
        "/location-service/locations",          
        {
          headers: {'Content-Type': 'application/json'},
          params: {
            business_id: auth.business_id
          }
        }
      )
    return response

}


