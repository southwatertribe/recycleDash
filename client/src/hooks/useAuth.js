import { useContext } from "react";
import AuthContext from "../contextTemp";


//Hook to maintain auth state 
const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;
