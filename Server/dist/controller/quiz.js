var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import assert, { AssertionError } from "assert";
import { Quiz } from "../models/Quiz.js";
import { Host } from "../models/Host.js";
import mongoose from "mongoose";
import { QuizItem } from "../models/QuizItem.js";
import { Option } from "../models/Option.js";
import { v2 as cloudinary } from "cloudinary";
const isPopulated = (questions) => questions.questions !== undefined;
function uploadFileToCloudinary(file, folder, quality) {
    return __awaiter(this, void 0, void 0, function* () {
        const resourceType = "auto";
        const options = quality
            ? { folder, quality, resource_type: resourceType }
            : { folder, resource_type: resourceType };
        const data = yield cloudinary.uploader.upload(file.tempFilePath, options);
        return data;
    });
}
const createQuiz = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newQuiz = yield Quiz.create({ title: "Untitled Quiz" });
        assert(newQuiz, "Something went wrong for creating quiz");
        yield Host.findByIdAndUpdate({ _id: userId }, {
            $push: {
                quizes: newQuiz._id,
            },
        });
        return {
            success: true,
            message: "Quiz created successfully",
            data: newQuiz,
            title: newQuiz.title,
        };
    }
    catch (error) {
        if (error instanceof AssertionError)
            return {
                status: false,
                msg: error.message,
            };
        return {
            status: false,
            msg: "Error",
        };
    }
});
const allQuiz = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = yield Host.findById(userId).populate("quizes").exec();
        return {
            success: true,
            message: "All quiz fetched successfully",
            data: host === null || host === void 0 ? void 0 : host.quizes,
        };
    }
    catch (error) {
        if (error instanceof AssertionError)
            return {
                success: false,
                msg: error.message,
            };
        return {
            success: false,
            msg: "Error",
        };
    }
});
const deleteQuiz = (userId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = yield Host.findByIdAndUpdate(userId, {
            $pull: {
                quizes: quizId,
            },
        });
        assert(host, "Something wrong while updating the quiz details");
        yield Quiz.deleteOne({ _id: quizId });
        return {
            success: true,
            message: "Quiz deleted successfully",
        };
    }
    catch (error) {
        console.log(error);
        if (error instanceof AssertionError)
            return {
                success: false,
                msg: error.message,
            };
        return {
            success: false,
            msg: "Error",
        };
    }
});
const questionData = (userId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = yield Host.findById(userId)
            .populate({
            path: "quizes",
            populate: {
                path: "questions",
                match: {
                    $or: [
                        { options: { $exists: true, $ne: [] } },
                        { options: { $exists: false } },
                    ],
                },
                populate: {
                    path: "options",
                },
            },
        })
            .exec();
        assert(data, "User not found");
        const existQuiz = (_a = data.quizes) === null || _a === void 0 ? void 0 : _a.some((quiz) => (quiz === null || quiz === void 0 ? void 0 : quiz._id.toString()) === quizId);
        assert(existQuiz, "quizId is not valid");
        const quiz = (_b = data.quizes) === null || _b === void 0 ? void 0 : _b.filter((quiz) => (quiz === null || quiz === void 0 ? void 0 : quiz._id.toString()) === quizId);
        let que;
        let title;
        if (quiz && isPopulated(quiz[0])) {
            que = quiz[0].questions;
            title = quiz[0].title;
        }
        return {
            success: true,
            message: "Data fetched successfully",
            questions: que,
            title: title,
        };
    }
    catch (error) {
        console.log(error);
        if (error instanceof AssertionError)
            return {
                status: false,
                message: error.message,
            };
        return {
            status: false,
            message: "Error",
        };
    }
});
const updateQuestion = (userId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
const createQuestion = (quizId, question, selectedType, questionTime, parseOptions, questionImg, optionImgs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const optionImagesArray = optionImgs
            ? Array.isArray(optionImgs)
                ? optionImgs
                : [optionImgs]
            : [];
        let questionImageData = null;
        if (questionImg != null)
            questionImageData = yield uploadFileToCloudinary(questionImg, "Quiz_App", 30);
        const optionPromises = parseOptions.map((option) => __awaiter(void 0, void 0, void 0, function* () {
            let optionImageData = null;
            if (optionImagesArray) {
                const matchingImg = optionImagesArray.find((img) => img.name.substring(img.name.length - 6) == option.id);
                if (matchingImg) {
                    optionImageData = yield uploadFileToCloudinary(matchingImg, "Quiz_App", 30);
                }
            }
            const ans = yield Option.create({
                text: option.text,
                isSelect: option.isSelect,
                optionImgId: (optionImageData === null || optionImageData === void 0 ? void 0 : optionImageData.public_id) || null,
                optionImg: (optionImageData === null || optionImageData === void 0 ? void 0 : optionImageData.secure_url) || null,
            });
            return ans._id;
        }));
        const optionIds = yield Promise.all(optionPromises);
        const questionData = yield QuizItem.create({
            question: question,
            questionType: selectedType,
            duration: questionTime,
            options: optionIds,
            questionImg: questionImageData === null || questionImageData === void 0 ? void 0 : questionImageData.secure_url,
            questionImgId: questionImageData === null || questionImageData === void 0 ? void 0 : questionImageData.public_id,
        });
        const quiz = yield Quiz.findByIdAndUpdate(quizId, {
            $push: {
                questions: questionData._id,
            },
        });
        return {
            success: true,
            message: "successfully",
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
const updateTitle = (userId, quizId, title) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostData = yield Host.findById(userId);
        assert(hostData, "Host not found");
        const quizData = yield Quiz.findByIdAndUpdate(quizId, { title: title }, { new: true });
        assert(quizData, "Quiz not found");
        return {
            success: true,
            message: "Title updated successfully",
            title: quizData.title,
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
const playQuiz = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pin;
        do {
            pin = Math.floor(100000 + Math.random() * 900000);
        } while (yield Quiz.findOne({ pin }));
        const quiz = yield Quiz.findByIdAndUpdate(quizId, { pin: pin });
        assert(quiz, "Something went wrong while creating the pin of quiz");
        return {
            success: true,
            message: "Quiz pin created successfully",
            pin: quiz.pin,
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
const quizPinAndTitle = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield Quiz.findById(quizId, "title pin");
        assert(quiz, "Something went wrong while creating the pin of quiz");
        return {
            success: true,
            message: "Quiz pin created successfully",
            pin: quiz.pin,
            title: quiz.title,
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
const questionsIds = (userId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield Host.findById(userId);
        assert(user, "user not found");
        const quiz = yield Quiz.findById(quizId);
        assert(quiz, "Quiz not found");
        const questionIds = (_a = quiz.questions) === null || _a === void 0 ? void 0 : _a.map((id) => id.toString());
        return {
            success: true,
            message: "Question Id fetched successfully",
            questionIds: questionIds
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
const questionDetails = (questionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield QuizItem.findById(new mongoose.Types.ObjectId(questionId)).populate("options");
        assert(question, "Question not found");
        return {
            success: true,
            message: "Question data fetched successfully",
            questionData: question
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
export { createQuiz, allQuiz, deleteQuiz, questionData, updateQuestion, createQuestion, playQuiz, quizPinAndTitle, updateTitle, questionsIds, questionDetails, };
