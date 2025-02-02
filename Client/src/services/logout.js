import { authEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function logout() {
    try {
        const response = await axiosInstance.post(authEndpoints.LOGOUT_API, {},
            {
                withCredentials: true,
            }
        )

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    }
    catch (error) {
        console.log(error);
    }
}

export default logout;