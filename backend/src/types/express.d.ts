import { Request } from "express";
import { IUser } from "../model/user.model"; 


declare module "express-serve-static-core" {
  interface Request {
    user?: any | null;
  }
}
