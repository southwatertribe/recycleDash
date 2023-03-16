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
            async config => {
                console.log("Request Intercept")
                console.log(config.headers.Authorization)
                if (!config.headers['Authorization']) {
                    console.log("There was no auth header")
                    const newAccessToken = await refresh();
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    console.log("After adding")
                    console.log(config.headers.Authorization)

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
                    console.log("Made it here??????")
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
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