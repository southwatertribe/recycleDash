import React from 'react'
import axios from '../utils/axios';
import useAuth from './useAuth';

//Uses refresh token from api
const useRefresh = () => {
    const  { setAuth } = useAuth();//ability to reauth upon refresh
    const refresh = async () => { //Request our refresh service
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev=> {
          console.log("Old")
          console.log(prev.at)
          console.log("NEW")
          console.log(response.data.accessToken)
          return {...prev, at: response.data.accessToken}
        })
        return response.data.accessToken
    }
  return refresh
}

export default useRefresh