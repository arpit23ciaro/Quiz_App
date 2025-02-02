import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_REACT_APP_BACKEND_BASEURL,
    timeout:20000,
    headers:{
        "Content-Type":"Application/json"
    }
}) 