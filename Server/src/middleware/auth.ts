import assert from "assert";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    assert(token, "Token is missing");

    const decode: JwtPayload = (jwt.verify(
      token,
      JWT_SECRET
    )) as JwtPayload;
    
    req.user = decode;
    next();
  } catch (error) {
    console.log("error on the auth")
    next(error);
  }
};
