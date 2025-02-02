import passport, { use } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth2";
import { config } from "dotenv";
import { Host } from "../models/Host.js";
import jwt from "jsonwebtoken";
config();

interface User {
  id: string;
  name: string;
  email: string;
  token: string; 
}

passport.serializeUser(
  (user: Express.User, done: (err: any, id?: unknown) => void) => {
    done(null, user);
  }
);

passport.deserializeUser(function (
  user: Express.User,
  done: (err: any, user?: Express.User) => void
) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      request: Express.Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        let user = await Host.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
          user = new Host({ googleId, email, name, authType: "google" });
          await user.save();
        }
        const userEmail = user?.email;
        const id = user?._id;
        const payload = {
          email: userEmail,
          id: id,
        };
      
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: "24h",
        });

        done(null, { id, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
