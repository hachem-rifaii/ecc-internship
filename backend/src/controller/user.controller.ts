require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../model/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload,  } from "jsonwebtoken";
import {
  sendToken,
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/jwt";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
}
export const registrationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };
      const newUser = await userModel.create(user);
      sendToken(newUser, 200, res);
      res.status(201).json({
        success: true,
        user: newUser,
        message: "User registered successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("login running")
    try {
      console.log("Before DB call");
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
      }
      const user = await userModel.findOne({ email }).select("+password")
      console.log("get user ");
      if (!user) {
        console.log("User not found");
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      console.log("After DB call");
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
     sendToken(user,200,res)
      console.log("User found, sending response");
   
    } catch (error: any) {
      console.error("Error in login route:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      res
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      const message = "please login to access the resource";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );
      const refreshToken = jwt.sign(
        { id: decoded.id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "3d" }
      );

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userID = req.user?.id;
      if(!userID){
        return next(new ErrorHandler("User not found", 404));
      }
      const user = await userModel.findById(userID);
      if(!user){
        return next(new ErrorHandler("User not found", 404));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
