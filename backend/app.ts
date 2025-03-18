import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./src/middleware/error";
import userRouter from "./src/routes/user.routes";
import eventRouter from "./src/routes/event.routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();



app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,

  })
);


// routes
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);

// home route
app.use("/", (req, res) => {
  res.send("helo from Event calendar");
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
