import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function quizPinAndTitle(quizId) {
    try {
        const response = await axiosInstance.get(quizEndpoints.QUIZ_PIN_AND_TITLE,
            {
                params: {
                    quizId: quizId
                },
                withCredentials: true
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

export default quizPinAndTitle;