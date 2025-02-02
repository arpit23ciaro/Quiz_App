import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function allQuiz() {
    try {
        const response = await axiosInstance.get(quizEndpoints.ALL_QUIZ_API,
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

export default allQuiz;