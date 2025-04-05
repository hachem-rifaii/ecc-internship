import express from "express";
import {
  create,
  destroy,
  index,
  show,
  update,
} from "../../controller/admin/category.controller";
import { isAdmin, isAuthenticated } from "../../middleware/auth";

const categoryRoute = express.Router();

categoryRoute.get("", index);
categoryRoute.post("", isAuthenticated, isAdmin, create);
categoryRoute.get("/:id", show);
categoryRoute.put("/:id", isAuthenticated, isAdmin, update);
categoryRoute.delete("/:id", isAuthenticated, isAdmin, destroy);

export default categoryRoute;
