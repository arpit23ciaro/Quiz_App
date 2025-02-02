import { AssertionError } from "assert";
import { Host } from "../models/Host.js";
import bcrypt from "bcrypt";
import crypto from 'crypto'
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import assert from "assert";
import mongoose from "mongoose";
import isValidPassword from "../utils/isValidPassword.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { mailSender } from "./mailSender.js";

config();

const signup = async (email: string, name:string, password: string) => {
  try {
    const existingHost = await Host.findOne({ email });
    assert(!existingHost, "Host is already register");

    const validatePassword = isValidPassword(password);
    assert(validatePassword =="",validatePassword);


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Host.create({
      name:name,
      email: email,
      password: hashedPassword,
      authType:"email-password"

    });
    return {
      success: true,
      message: "Host created successfully!",
    };
  } catch (error) {
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
};

const login = async (email: string, password: string) => {
  try {
    const user = await Host.findOne({ email });
    assert(user, "Invalid user credentials");

    const isPasswordValid =
      user?.password && (await bcrypt.compare(password, user.password));

    assert(isPasswordValid, "Invalid Password");

    const payload = {
      email: user?.email,
      id: user?._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    if (user && user?.token) user.token = token;
    if (user && user?.password) user.password = "";

    return {
      success: true,
      token:token,
      id:user._id,
      message: "Logged in successfully",
    };
  } catch (error) {
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
};

const forgotPassword = async (email: string) => {
    try {
      const host = await Host.findOne({ email });
      assert(host, "Host is not registered");
  
      const token = crypto.randomUUID();
  
      const updatedDetails = await PasswordResetToken.findOneAndUpdate(
        { userId: host?._id },
        {
          token: token,
          expiryDate: Date.now() + 5 * 60 * 1000,
        },
        {upsert:true, new: true }
      );
  
      const url = `http://localhost:5173/reset-password/${token}`;
  
      const mailUpdate = await mailSender(
        email,
        "PASSWORD RESET LINK",
        `Password reset link ${url}`
      )
  
      return {
        success: true,
        message:
          "Email send successfully, please check email and change password",
      };
    } catch (error) {
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
};
  
const resetPassword = async (password: string, token: string) => {
    try {
      const userDetails = await PasswordResetToken.findOne({ token: token });
      assert(userDetails, "Token is invalid");
   
      if(userDetails){
      assert(
         userDetails?.expiryDate?.getTime() > Date.now(),
        "Token is expire, please regenerate it."
      );}
     
      const user = await Host.findById(userDetails?.userId);
  
      assert(user,"User not found")
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await Host.findByIdAndUpdate(
        userDetails?.userId,
        {
          $push: { previousPassword: user?.password },
          password: hashedPassword,
        },
  
        { new: true }
      );
      
      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      if (error instanceof AssertionError)
        return {
          status: false,
          msg: error.message,
        };
        console.log(error)
      return {
        status: false,
        msg: "Error",
      };
    }
};

export {
    signup,
    login,
    forgotPassword,
    resetPassword,
}