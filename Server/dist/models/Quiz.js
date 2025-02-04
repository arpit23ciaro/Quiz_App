import mongoose, { Schema } from "mongoose";
const quizSchema = new Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuizItem",
        },
    ],
    pin: {
        type: String
    }
});
export const Quiz = mongoose.model("Quiz", quizSchema);
