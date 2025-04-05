import express from "express";
import {
  destroy,
  index,
  show,
  update,
} from "../../controller/admin/order.controller";
import { isAdmin, isAuthenticated } from "../../middleware/auth";

const orderRoute = express.Router();

orderRoute.get("",        isAuthenticated, isAdmin, index);
orderRoute.get("/:id",    isAuthenticated, isAdmin, show);
orderRoute.put("/:id",    isAuthenticated, isAdmin, update);
orderRoute.delete("/:id", isAuthenticated, isAdmin, destroy);

export default orderRoute;
