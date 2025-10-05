import axios from "axios"

const baseURL = import.meta.env.VITE_BASE_URL

const options = {
    baseURL,
    withCredentials: true,
    timeout: 10000
}
const API = axios.create(options)

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        const {data,status}=error.message

        if(data ==="Unauthorized" && status === 401){
            window.location.href="/"
    }
    return Promise.reject(error)

})


export default API