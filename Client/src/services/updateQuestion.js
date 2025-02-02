import { quizEndpoints } from "../utils/apis";
import { axiosInstance } from "../utils/axios/axiosInstance";



async function updateQuestion(formData) {
    try {
        console.log(formData)
        const response = await axiosInstance.post(quizEndpoints.UPDATE_QUESTION_API, formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
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

export default updateQuestion;