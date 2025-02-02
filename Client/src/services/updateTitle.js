import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function updateTitle(quizId, title) {
    try {
        const response = await axiosInstance.post(quizEndpoints.UPDATE_TITLE_API,
            {
                quizId: quizId,
                title: title
            },{
                withCredentials:true,
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

export default updateTitle;