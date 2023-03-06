import React from 'react'
import axios from '../utils/axios';
import useAuth from './useAuth';

//Uses refresh token from api
const useRefresh = () => {
    const  { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        })
    }
  return (
    <div>useRefresh</div>
  )
}

export default useRefresh