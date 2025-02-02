import { axiosInstance } from "../../utils/axios/axiosInstance";
import { userEndpoints } from "../../utils/apis";



async function checkValidPin(pin) {
    try {
        const response = await axiosInstance.post(userEndpoints.CHECK_VALID_PIN,
            {
                pin:pin
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

export default checkValidPin;