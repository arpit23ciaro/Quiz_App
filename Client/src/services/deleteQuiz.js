import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function deleteQuiz(quizId) {
    try {
        const response = await axiosInstance.delete(`${quizEndpoints.DELETE_QUIZ_API}?quizId=${quizId}`,
            {
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

export default deleteQuiz;