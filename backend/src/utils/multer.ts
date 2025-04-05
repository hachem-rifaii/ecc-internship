import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "path";


const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "uploads/");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = path.parse(file.originalname).name; 
    cb(null, `${filename}-${uniqueSuffix}.png`);
    
  },
});





export const upload = multer({ storage });
