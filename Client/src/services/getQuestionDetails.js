import { userEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function getQuestionDetails(questionId) {
    try {
        const response = await axiosInstance.get(userEndpoints.QUESTION_DETAILS_API,
            {
                params:{
                    questionId:questionId
                },
                withCredentials:true
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

export default getQuestionDetails;