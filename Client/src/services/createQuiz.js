import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function createQuiz() {
    try {
        const response = await axiosInstance.post(quizEndpoints.CREATE_QUIZ_API,
            {}
            , { withCredentials: true }
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

export default createQuiz;