import * as dotenv from "dotenv";
dotenv.config();
import { Response } from "express";
import { IUser } from "../model/user.model";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}
export const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRATION || "300",
  10
);
export const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRATION || "1200",
  10
);
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), 
  maxAge: accessTokenExpire * 60 * 1000, 
  httpOnly: true,
  sameSite: "none",
  secure: true
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();
  console.log("go to send token");


  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  console.log("sending the token");

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
