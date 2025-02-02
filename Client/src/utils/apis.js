

export const authEndpoints = {
    LOGIN_API: '/login',
    LOGOUT_API: '/logout',
    SIGNUP_API: '/signup',
    FORGOT_PASSWORD_API: '/forgotPassword',
    RESET_PASSWORD_API: '/resetPassword',
    GOOGLE_SIGNUP_API: '/auth/google',
    LOGIN_STATUS_API: '/auth/check'
}

export const quizEndpoints = {
    CREATE_QUIZ_API: '/createQuiz',
    ALL_QUIZ_API: '/allQuiz',
    DELETE_QUIZ_API: '/deleteQuiz',
    QUESTIONS_DATA_API: '/questionsData',
    UPDATE_QUESTION_API:'/updateQuestion',
    UPDATE_TITLE_API: '/updateTitle',
    PLAY_QUIZ_API: '/playQuiz',
    QUIZ_PIN_AND_TITLE:'/quizPinAndTitle'
}

export const userEndpoints= {
    CHECK_VALID_PIN: '/checkValidPin',
    ALL_QUESTION_IDS_API: '/allQuestionIds',
    QUESTION_DETAILS_API: '/questionDetails',
    GET_SCORE_API: '/getScore'
}