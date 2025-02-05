import { Router } from "express";
import * as authController from "../controller/auth.js";
import isEmpty from "../utils/isEmpty.js";
import { config } from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { auth } from "../middleware/auth.js";
config();
const emailRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

emailRouter.get("/auth/check", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(200)
      .json({ authenticated: false, message: "No token provided" });
  } else {
    try {
      const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      res.status(200).json({ authenticated: true, user: decoded });
    } catch (err) {
      res.status(200).json({ authenticated: false, message: "Invalid token" });
    }
  }
});

emailRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email, password)) {
    res.status(400).json({
      success: false,
      message: "All field are required",
    });
  } else {
    const data = await authController.login(email, password);
    data.success
      ? res
          .cookie("token", data.token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
            sameSite:"none",
            httpOnly:true
          })
          .json({
            success: data.success,
            id: data.id,
            message: data.message,
          })
      : res.status(404).json(data);
  }
});

emailRouter.post("/logout",auth, async (req ,res) => {
  res.clearCookie("token",{
    secure:true,
    sameSite:"none",
    httpOnly:true
  }).status(200).json({
    success:true,
    message:"User logout successfully"
  })
})

emailRouter.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;
  if (isEmpty(email, password, name)) {
    res.status(400).json({
      success: false,
      message: "All field are required",
    });
  } else {
    const data = await authController.signup(email, name, password);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

emailRouter.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  if (isEmpty(email)) {
    res.status(400).json({
      success: false,
      message: "All field are required",
    });
  } else {
    const data = await authController.forgotPassword(email);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

emailRouter.post("/resetPassword", async (req, res) => {
  const { token, password } = req.body;
  if (isEmpty(token, password)) {
    res.status(400).json({
      success: false,
      message: "All field are required",
    });
  } else {
    const data = await authController.resetPassword(password, token);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

export default emailRouter;
