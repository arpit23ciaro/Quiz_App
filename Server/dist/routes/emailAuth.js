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
import * as authController from "../controller/auth.js";
import isEmpty from "../utils/isEmpty.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";
config();
const emailRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
emailRouter.get("/auth/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        res
            .status(200)
            .json({ authenticated: false, message: "No token provided" });
    }
    else {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            res.status(200).json({ authenticated: true, user: decoded });
        }
        catch (err) {
            res.status(200).json({ authenticated: false, message: "Invalid token" });
        }
    }
}));
emailRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (isEmpty(email, password)) {
        res.status(400).json({
            success: false,
            message: "All field are required",
        });
    }
    else {
        const data = yield authController.login(email, password);
        data.success
            ? res
                .cookie("token", data.token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
                httpOnly: true
            })
                .json({
                success: data.success,
                id: data.id,
                message: data.message,
            })
            : res.status(404).json(data);
    }
}));
emailRouter.post("/logout", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token", {
        secure: true,
        sameSite: "none",
        httpOnly: true
    }).status(200).json({
        success: true,
        message: "User logout successfully"
    });
}));
emailRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    if (isEmpty(email, password, name)) {
        res.status(400).json({
            success: false,
            message: "All field are required",
        });
    }
    else {
        const data = yield authController.signup(email, name, password);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
emailRouter.post("/forgotPassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (isEmpty(email)) {
        res.status(400).json({
            success: false,
            message: "All field are required",
        });
    }
    else {
        const data = yield authController.forgotPassword(email);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
emailRouter.post("/resetPassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    if (isEmpty(token, password)) {
        res.status(400).json({
            success: false,
            message: "All field are required",
        });
    }
    else {
        const data = yield authController.resetPassword(password, token);
        data.success ? res.json(data) : res.status(404).json(data);
    }
}));
export default emailRouter;
