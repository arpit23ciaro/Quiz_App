import mongoose, { Schema } from "mongoose";
const quizItemSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    questionImgId: {
        type: String,
    },
    questionImg: {
        type: String,
    },
    options: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Option",
        },
    ],
    questionType: {
        type: String,
    },
    duration: {
        type: String,
    },
});
export const QuizItem = mongoose.model("QuizItem", quizItemSchema);
