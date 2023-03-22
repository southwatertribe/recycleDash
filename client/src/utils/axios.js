//This wll help set a base url for axios api calls
import axios from "axios"

export default axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})