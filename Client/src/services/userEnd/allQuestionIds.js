import { userEndpoints } from "../../utils/apis";
import { axiosInstance } from "../../utils/axios/axiosInstance";



async function allQuestionIds(quizId) {
    try {
        const response = await axiosInstance.get(userEndpoints.ALL_QUESTION_IDS_API,
            {
                params: {
                    quizId: quizId
                },
                withCredentials:true
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

export default allQuestionIds;