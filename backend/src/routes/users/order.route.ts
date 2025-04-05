import express from "express";
import { index, show , create} from "../../controller/users/order.controller";
import { isAuthenticated } from "../../middleware/auth";

const userOrderRoute = express.Router();

userOrderRoute.get("", isAuthenticated, index);
userOrderRoute.post("", isAuthenticated , create);
userOrderRoute.get("/:id", isAuthenticated, show);

export default userOrderRoute;
