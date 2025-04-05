import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./src/middleware/error";
import userRouter from "./src/routes/user.routes";
import dotenv from "dotenv";
import passport from "./src/config/passportConfig";
import session from "express-session";
import categoryRoute from "./src/routes/admin/category.routes";
import productRoute from "./src/routes/admin/product.routes";
import path from "path";
import fs from "fs";
import orderRoute from "./src/routes/admin/order.route";
import userOrderRoute from "./src/routes/users/order.route";
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "f3e1a6b74a79d3c5e9f7b1a2c8d4e5f6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2",
    resave: false,
    saveUninitialized: false,
  })
);

// إعداد Passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/user-orders", userOrderRoute);

// home route
app.use("/", (req, res) => {
  res.send("helo from eccomrce internship");
});
// unknown route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    message: "Route not found",
    statusCode: 404,
  });
});

// error handling middleware
app.use(ErrorMiddleware);

export default app;
