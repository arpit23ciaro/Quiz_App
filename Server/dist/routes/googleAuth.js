import { Router } from "express";
import passport from "passport";
import '../utils/passport.js';
import cookieParser from 'cookie-parser';
import { config } from "dotenv";
config();
const googleRouter = Router();
googleRouter.use(cookieParser());
googleRouter.use(passport.initialize());
googleRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));
googleRouter.get('/auth/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
}), (req, res) => {
    const { id, token } = req.user;
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: "none"
    });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/${id}`);
});
export default googleRouter;
