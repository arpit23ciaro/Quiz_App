import { authEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function loginStatus() {
    try {
        const response = await axiosInstance.get(authEndpoints.LOGIN_STATUS_API, { withCredentials: true })
        return response;
    }
    catch (error) {
        console.log(error);
    }
}

export default loginStatus;