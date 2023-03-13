import { axiosPrivate } from "../utils/axios";
import { useEffect } from "react";
import useRefresh from "./useRefresh";
import useAuth from "./useAuth";

//This is to retry incase of expired jwts

const useAxiosPrivate = () => {
    const refresh = useRefresh();
    const { auth } = useAuth();

    useEffect(()=>{
        //Attach accesstoken before sending the request 
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                console.log("Request Intercept")
                console.log(config)
                if (!config.headers['authorization']) {
                    
                    config.headers['authorization'] = `Bearer ${auth?.at}`;
                    console.log(config.headers['authorization'])
                }
                return config;
            }, (err) => Promise.reject(err)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response, //if response is 200 continue
            async (err) => {
                console.log("ERROR")
                console.log(err)
                const prevRequest = err?.config

                console.log(prevRequest.headers)
                if (err?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(err);
            }
        );
        return ()=> {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
            
        }
    }, [auth, refresh])
    return axiosPrivate;
}

export default useAxiosPrivate;