import { authEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function resetPassword(token, password) {
    try {
        const response = await axiosInstance.post(authEndpoints.RESET_PASSWORD_API,
            {
                token: token,
                password: password
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

export default resetPassword;