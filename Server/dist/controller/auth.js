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
import { Host } from "../models/Host.js";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import assert from "assert";
import isValidPassword from "../utils/isValidPassword.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { mailSender } from "./mailSender.js";
config();
const signup = (email, name, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingHost = yield Host.findOne({ email });
        assert(!existingHost, "Host is already register");
        const validatePassword = isValidPassword(password);
        assert(validatePassword == "", validatePassword);
        const hashedPassword = yield bcrypt.hash(password, 10);
        const user = yield Host.create({
            name: name,
            email: email,
            password: hashedPassword,
            authType: "email-password"
        });
        return {
            success: true,
            message: "Host created successfully!",
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
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Host.findOne({ email });
        assert(user, "Invalid user credentials");
        const isPasswordValid = (user === null || user === void 0 ? void 0 : user.password) && (yield bcrypt.compare(password, user.password));
        assert(isPasswordValid, "Invalid Password");
        const payload = {
            email: user === null || user === void 0 ? void 0 : user.email,
            id: user === null || user === void 0 ? void 0 : user._id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        if (user && (user === null || user === void 0 ? void 0 : user.token))
            user.token = token;
        if (user && (user === null || user === void 0 ? void 0 : user.password))
            user.password = "";
        return {
            success: true,
            token: token,
            id: user._id,
            message: "Logged in successfully",
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
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = yield Host.findOne({ email });
        assert(host, "Host is not registered");
        const token = crypto.randomUUID();
        const updatedDetails = yield PasswordResetToken.findOneAndUpdate({ userId: host === null || host === void 0 ? void 0 : host._id }, {
            token: token,
            expiryDate: Date.now() + 5 * 60 * 1000,
        }, { upsert: true, new: true });
        const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const mailUpdate = yield mailSender(email, "PASSWORD RESET LINK", `Password reset link ${url}`);
        return {
            success: true,
            message: "Email send successfully, please check email and change password",
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
const resetPassword = (password, token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userDetails = yield PasswordResetToken.findOne({ token: token });
        assert(userDetails, "Token is invalid");
        if (userDetails) {
            assert(((_a = userDetails === null || userDetails === void 0 ? void 0 : userDetails.expiryDate) === null || _a === void 0 ? void 0 : _a.getTime()) > Date.now(), "Token is expire, please regenerate it.");
        }
        const user = yield Host.findById(userDetails === null || userDetails === void 0 ? void 0 : userDetails.userId);
        assert(user, "User not found");
        const hashedPassword = yield bcrypt.hash(password, 10);
        yield Host.findByIdAndUpdate(userDetails === null || userDetails === void 0 ? void 0 : userDetails.userId, {
            $push: { previousPassword: user === null || user === void 0 ? void 0 : user.password },
            password: hashedPassword,
        }, { new: true });
        return {
            success: true,
            message: "Password reset successfully",
        };
    }
    catch (error) {
        if (error instanceof AssertionError)
            return {
                status: false,
                msg: error.message,
            };
        console.log(error);
        return {
            status: false,
            msg: "Error",
        };
    }
});
export { signup, login, forgotPassword, resetPassword, };
