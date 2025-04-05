import express from "express";
import {
  create,
  destroy,
  index,
  show,
  update,
} from "../../controller/admin/product.controller";
import { upload } from "../../utils/multer";
import { isAdmin, isAuthenticated } from "../../middleware/auth";

const productRoute = express.Router();

productRoute.get("", index);
productRoute.post("", upload.single("image"), isAuthenticated, isAdmin, create);
productRoute.get("/:id", show);
productRoute.put("/:id", upload.single("image"),isAuthenticated, isAdmin ,update);
productRoute.delete("/:id", isAuthenticated, isAdmin  ,destroy);

export default productRoute;
