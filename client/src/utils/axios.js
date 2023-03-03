//This wll help set a base url for axios api calls
import axios from "axios"

export default axios.create({
    baseURL: 'http://localhost:3001'
})