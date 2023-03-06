import { useContext } from "react";
import AuthContext from "../contextTemp";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;
