import express, { NextFunction, Request, Response } from "express";

import {
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
  createAdmin
} from "../controller/user.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import passport from "passport";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
// google auth
userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  async (req: Request, res: Response) => {
    console.log("User after authentication:", req.user);
    if (!req.user) {
      res.status(401).json({ message: "Authentication failed" });
      return; // تأكد أن المعالج ينتهي هنا بدون إرجاع `Response`
    }

    const user = req.user as any;
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    console.log("go to send token");

    // Set cookies (optional, depending on your setup)
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    // Redirect to the frontend with the token in the URL
    res.redirect(`http://localhost:3000`);
  }
);

// create admin 
userRouter.post("/create-admin" , isAuthenticated , isAdmin , createAdmin)


export default userRouter;
