var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as quizController from "../controller/quiz.js";
import { Router } from "express";
import isEmpty from "../utils/isEmpty.js";
const quizRouter = Router();
quizRouter.post("/createQuiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (isEmpty(id)) {
        res.status(400).json({
            success: false,
            message: "All field are require",
        });
    }
    else {
        const data = yield quizController.createQuiz(id);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.delete("/deleteQuiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const quizId = req.query.quizId;
    if (isEmpty(id, quizId)) {
        res.status(400).json({
            success: false,
            message: "All field are require",
        });
    }
    else {
        const data = yield quizController.deleteQuiz(id, quizId);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.get("/allQuiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (isEmpty(id)) {
        res.status(400).json({
            success: false,
            message: "All field are require",
        });
    }
    else {
        const data = yield quizController.allQuiz(id);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.post("/updateTitle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const { title, quizId } = req.body;
    if (isEmpty(id, title, quizId)) {
        res.status(400).json({
            success: false,
            message: "All fields are require",
        });
    }
    else {
        const data = yield quizController.updateTitle(id, quizId, title);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.post("/questionsData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { quizId } = req.body;
    if (isEmpty(id, quizId)) {
        res.status(400).json({
            success: false,
            message: "All field are require",
        });
    }
    else {
        const data = yield quizController.questionData(id, quizId);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.post("/updateQuestion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: questionId, quizId } = req.body;
    if (isEmpty(questionId, quizId)) {
        res.status(400).json({
            success: false,
            message: "questionId not found",
        });
    }
    else {
        if (questionId.substring(0, questionId.length - 1) == "dummy") {
            const { question, selectedType, questionTime, options } = req.body;
            const parseOptions = JSON.parse(options);
            let questionImg = null;
            let optionImgs = null;
            if (req.files) {
                questionImg = req.files.questionImg;
                optionImgs = req.files.optionImgs;
            }
            if (isEmpty(question, selectedType, questionTime, parseOptions)) {
                res.status(400).json({
                    success: false,
                    message: "All field are required",
                });
            }
            else {
                const data = yield quizController.createQuestion(quizId, question, selectedType, questionTime, parseOptions, questionImg, optionImgs);
            }
        }
        else {
            console.log("pending..");
        }
    }
}));
quizRouter.get("/allQuestionIds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const quizId = typeof req.query.quizId === "string" ? req.query.quizId : "";
    if (isEmpty(id)) {
        res.status(400).json({
            success: false,
            message: "All field are require",
        });
    }
    else {
        const data = yield quizController.questionsIds(id, quizId);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.post("/playQuiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId } = req.body;
    if (isEmpty(quizId)) {
        res.status(400).json({
            success: false,
            message: "All fields are require"
        });
    }
    else {
        const data = yield quizController.playQuiz(quizId);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.get("/quizPinAndTitle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizId = typeof req.query.quizId === "string" ? req.query.quizId : "";
    if (isEmpty(quizId)) {
        res.status(400).json({
            success: false,
            message: "All fields are require"
        });
    }
    else {
        const data = yield quizController.quizPinAndTitle(quizId);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
quizRouter.get("/questionDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = typeof req.query.questionId === "string" ? req.query.questionId : "";
    if (isEmpty(questionId)) {
        res.status(400).json({
            success: false,
            message: "All fields are require"
        });
    }
    else {
        const data = yield quizController.questionDetails(questionId);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
export default quizRouter;
