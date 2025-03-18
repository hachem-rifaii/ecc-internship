import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler"; // Make sure this is implemented correctly
import { catchAsyncError } from "./catchAsyncErrors"; // Ensure this is handling async errors properly
import dotenv from "dotenv";

dotenv.config();
// Assuming JwtPayload has an 'id' property
interface DecodedToken extends JwtPayload {
  id: string;
}

export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from the Authorization header
    const access_token = req.headers["authorization"]?.split(" ")[1];
    if (!access_token) {
      return next(new ErrorHandler("Not authenticated", 400));
    }
    

    console.log("Received Token:", access_token);
    if (!access_token) {
      // If no token is provided, send an error
      return next(new ErrorHandler("Not authenticated", 400));
    }

    try {
      console.log("JWT Secret Key:", process.env.ACCESS_TOKEN);

      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
     ) as JwtPayload;
     
     console.log("Decoded Token ID:", decoded?.id);
     

      if (!decoded.id) {
        return next(new ErrorHandler("Access token is not valid", 400));
      }

      req.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // If JWT verification fails (invalid token, expired token, etc.), send an error
      return next(new ErrorHandler("Token verification failed" + error, 400));
    }
  }
);
