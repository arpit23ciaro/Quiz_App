import { authEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function googleAuth() {
    try {
        const response = await axiosInstance.post(authEndpoints.LOGIN_API,
            {
                email: email,
                password: password
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

export default login;