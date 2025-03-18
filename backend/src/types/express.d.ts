import { Request } from "express";
import { IUser } from "../model/user.model"; // تأكد من استيراد واجهة المستخدم الصحيحة

// إضافة `user` إلى Request
declare module "express-serve-static-core" {
  interface Request {
    user?: any | null;
  }
}
