import { authEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function forgotPassword(email) {
    try {
        const response = await axiosInstance.post(authEndpoints.FORGOT_PASSWORD_API,
            {
                email: email,
            }
        )
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        return response;
    }
    catch (error) {
        console.log(error);
    }
}

export default forgotPassword;