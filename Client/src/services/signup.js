import { authEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function signup(name , email, password ) {
    try {
        const response = await axiosInstance.post(authEndpoints.SIGNUP_API,
            {
                name:name,
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

export default signup;