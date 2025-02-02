import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function questionsData(quizId) {
    try {
        const response = await axiosInstance.post(quizEndpoints.QUESTIONS_DATA_API,
            {
                quizId: quizId
            },
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

export default questionsData;