import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function playQuiz(quizId) {
    try {

        const response = await axiosInstance.post(quizEndpoints.PLAY_QUIZ_API,
            {
                quizId: quizId
            },
            {
                withCredentials: true
            }
        )
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    }
    catch (error) {
        console.log('errror', error);
    }
}

export default playQuiz;