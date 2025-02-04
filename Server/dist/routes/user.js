var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import isEmpty from "../utils/isEmpty.js";
import * as userController from '../controller/user.js';
const userRouter = Router();
userRouter.post("/checkValidPin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pin } = req.body;
    if (isEmpty(pin)) {
        res.status(400).json({
            success: false,
            message: "pin is required"
        });
    }
    else {
        const data = yield userController.checkValidPin(pin);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
userRouter.get('/getScore', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = typeof req.query.questionId === "string" ? req.query.questionId : "";
    const time = typeof req.query.time === "string" ? req.query.time : "";
    let ids = typeof req.query.ids === "string"
        ? [req.query.ids]
        : Array.isArray(req.query.ids) && req.query.ids.every(id => typeof id === "string")
            ? req.query.ids
            : [];
    if (isEmpty(questionId, time, ids)) {
        res.status(400).json({ error: "No IDs provided" });
    }
    else {
        const selectedIds = Array.isArray(ids) ? ids : [ids];
        const data = yield userController.userScore(questionId, time, selectedIds);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
export default userRouter;
