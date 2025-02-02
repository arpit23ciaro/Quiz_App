import React, { useEffect, useState } from 'react'
import QuestionSlider from '../components/QuestionSlider';
import QuestionArea from '../components/QuestionArea';
import { useParams } from 'react-router-dom';
import questionsData from '../services/questionsData';
import updateQuestion from '../services/updateQuestion';
import updateTitle from '../services/updateTitle'

const CreateQuiz = () => {
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)
    console.log(currentQuestionIndex)
    const initialValue = {
        id: `dummy${questions?.length + 1}`,
        question: "",
        questionImg: null,
        options: [
            {
                id: "dummy1",
                text: "",
                isSelect: false,
                optionImg: null
            },
            {
                id: "dummy2",
                text: "",
                isSelect: false,
                optionImg: null
            },

        ],
        questionType: "Single choice",
        duration: "20s",
    }

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await questionsData(quizId);
                if (response && response.data.success) {
                    if (response.data.questions.length == 0) {
                        setQuestions([initialValue])
                    }
                    else {
                        const data = response.data.questions.map((que) =>
                        ({
                            ...que,
                            "options":que.options.map((option) =>
                                ({ ...option, isSelect: option.isSelect == "true" ? true : false }))
                        }))
                        setQuestions(data);
                    }
                    setTitle(response.data.title)
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    const submitTitle = async () => {
        try {
            setLoading(true);
            if (title.trim() != "") {
                const res = await updateTitle(quizId, title);
                if (res.data.success) {
                    setTitle(res.data.title);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        let formData = new FormData();
        formData.append("quizId", quizId);
        if (questions || questions.length <= currentQuestionIndex) {
            formData.append("id", values.id);
            formData.append("question", values.question);
            if (values.questionImg)
                formData.append("questionImg", values.questionImg);
            formData.append("questionTime", values.questionTime);
            formData.append("selectedType", values.selectedType);
            formData.append("options", JSON.stringify(values.options));
            values.options.forEach((option) => {
                if (option.optionImg) {
                    formData.append("optionImgs", option.optionImg, `${option.optionImg.name}+ciaro${option.id}`);
                }
            });
        }
        else {
            const data = questions[currentQuestionIndex];
            formData.append("id", values.id)
            if (data.question != values.question) formData.append("question", values.question);
            if (values.questionImg && data.questionImgName != values.questionImg.name) formData.append("questionImg", values.questionImg);
            if (data.duration != values.questionTime) formData.append("questionTime", values.questionTime);
            if (data.questionType != values.selectedType) formData.append("selectedType", values.selectedType)

            values.options.forEach((option, index) => {
                formData.append(`options[${index}][text]`, option.text);
                formData.append(`options[${index}][isSelect]`, option.isSelect);
                if (option.optionImg) {
                    formData.append(`options[${index}][optionImg]`, option.optionImg);
                }
            });

        }
        try {
            setLoading(true);
            const data = await updateQuestion(formData);
            console.log(data)
            if (data.data.success) {
                setSubmitting(false);
                resetForm();
            }

        }
        catch (error) {
            console.log("Error in signup api -> ", data.message)
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            {
                questions?.length > 0 ?
                    <QuestionArea submitTitle={submitTitle} question={questions[currentQuestionIndex]} title={title} setTitle={setTitle} handleSubmit={handleSubmit} setQuestions={setQuestions} />
                    : <div>Question not available</div>
            }
            <QuestionSlider
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                setQuestions={setQuestions}
                initialValue={initialValue}
            />
        </>
    )
}

export default CreateQuiz