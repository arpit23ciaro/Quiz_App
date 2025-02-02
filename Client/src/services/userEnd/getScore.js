import { axiosInstance } from "../../utils/axios/axiosInstance";
import { userEndpoints } from "../../utils/apis";



async function getScore(questionId,selectedAnswer,time) {
    const queryString = selectedAnswer.map(id => `ids=${id}`).join("&");
    try {
        const response = await axiosInstance.get(`${userEndpoints.GET_SCORE_API}?${queryString}`,
            {
                params: {
                    questionId: questionId,
                    time:time,
                },
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

export default getScore;