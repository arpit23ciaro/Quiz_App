var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AssertionError } from "assert";
import { Quiz } from "../models/Quiz.js";
import assert from "assert";
import { QuizItem } from "../models/QuizItem.js";
import mongoose from "mongoose";
const checkValidPin = (pin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(pin);
        const quizData = yield Quiz.findOne({ pin: pin });
        assert(quizData, "pin not found");
        return {
            success: true,
            message: "pin data fetched successfully",
            quizId: quizData === null || quizData === void 0 ? void 0 : quizData._id
        };
    }
    catch (error) {
        console.log(error);
        if (error instanceof AssertionError)
            return {
                success: false,
                message: error.message,
            };
        return {
            success: false,
            message: "Error",
        };
    }
});
const userScore = (questionId, time, selectedIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield QuizItem.findById(questionId).populate({ path: "options" });
        assert(question, "pin not found");
        const correctIds = question.options
            .filter(option => (option === null || option === void 0 ? void 0 : option.isSelect) === "true")
            .map((option) => option._id instanceof mongoose.Types.ObjectId ? option._id.toHexString() : option._id);
        const maxScore = 100;
        const timeLeft = parseInt(time);
        const matchedCount = selectedIds.filter(id => correctIds.includes(id)).length;
        const totalCorrect = correctIds.length;
        let score = 0;
        if (matchedCount === totalCorrect && matchedCount === selectedIds.length) {
            score = Math.floor((timeLeft / 10) * maxScore);
        }
        return {
            success: true,
            message: "score data fetched successfully",
            score: score
        };
    }
    catch (error) {
        console.log(error);
        if (error instanceof AssertionError)
            return {
                success: false,
                message: error.message,
            };
        return {
            success: false,
            message: "Error",
        };
    }
});
export { checkValidPin, userScore };
