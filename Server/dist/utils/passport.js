var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import { Strategy as GoogleStrategy, } from "passport-google-oauth2";
import { config } from "dotenv";
import { Host } from "../models/Host.js";
import jwt from "jsonwebtoken";
config();
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true,
}, (request, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        let user = yield Host.findOne({ $or: [{ googleId }, { email }] });
        if (!user) {
            user = new Host({ googleId, email, name, authType: "google" });
            yield user.save();
        }
        const userEmail = user === null || user === void 0 ? void 0 : user.email;
        const id = user === null || user === void 0 ? void 0 : user._id;
        const payload = {
            email: userEmail,
            id: id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        done(null, { id, token });
    }
    catch (error) {
        return done(error, null);
    }
})));
