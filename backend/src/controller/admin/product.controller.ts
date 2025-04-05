import { Request, Response, NextFunction } from "express";
import productModel, { IProduct } from "../../model/product.model";
import ErrorHandler from "../../utils/ErrorHandler";
import { catchAsyncError } from "../../middleware/catchAsyncErrors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
/**
 * @accpet page & limit
 * @return paginate category from db
 */
type filterData = {
  price?: number | { $gte: number; $lte: number };
  categoryId?: string;
};

export const index = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 10;
      let skip = (page - 1) * limit;
      const filter: filterData = {};

      if (req.query.price) {
        const priceRange = (req.query.price as string).split("-");
        filter.price =
          priceRange.length === 2
            ? { $gte: Number(priceRange[0]), $lte: Number(priceRange[1]) }
            : Number(req.query.price);
      }

      if (req.query.categoryId && typeof req.query.categoryId === "string") {
        filter.categoryId = req.query.categoryId;
      }

      const products = await productModel
        .find(filter)
        .populate("categoryId")
        .skip(skip)
        .limit(limit);

      const totalProducts = await productModel.countDocuments(filter);

      return res.status(200).json({
        success: true,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        products,
      });
    } catch (error: any | string) {
      return next(new ErrorHandler(`An error occurred: ${error.message}`, 500));
    }
  }
);

/**
 * @returns a catgory created
 */
export const create = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        isActive,
        price,
        discount_price,
        quantity,
        categoryId,
      } = req.body as IProduct;
      const isNameExist = await productModel.findOne({ name });

      if (isNameExist) {
        return next(new ErrorHandler("product Name already exists", 400));
      }
      const filename = req.file?.filename ?? "";
      const image = filename
        ? path.normalize(path.join("uploads", filename))
        : null;
      const newProduct = await productModel.create({
        name,
        price,
        discount_price,
        quantity,
        categoryId,
        image,
        description,
        isActive,
      });
      return res.status(201).json({
        message: "Product created successfuly",
        category: newProduct,
      });
    } catch (error: any | string) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
/**
 * update category
 */

export const update = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        isActive,
        quantity,
        discount_price,
        price,
        categoryId,
      } = req.body as IProduct;

      const existingProduct = await productModel.findById(id);
      if (!existingProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      let image = existingProduct.image;

      if (req.file) {
        const fileName = req.file.filename;
        const filePath = `uploads/${fileName}`;

        if (existingProduct.image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "..",
            existingProduct.image
          );
          fs.unlink(oldImagePath, function (err) {
            if (err) {
              console.log("Error deleting old file:", err);
              return res
                .status(500)
                .json({ message: "Error deleting old file" + err });
            }
            console.log("Old file deleted successfully");
          });
        }

        image = path.normalize(path.join("uploads", fileName));
      }

      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          name,
          description,
          isActive,
          image,
          quantity,
          categoryId,
          discount_price,
          price,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error: any | string) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 * @param id for category
 * @return a specifi category
 */
export const show = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorHandler("wrong credential", 400));
      }
      const product = await productModel.findById(id).populate("categoryId");
      if (!product) {
        return next(new ErrorHandler("product not found", 404));
      }

      return res.status(200).json({
        product,
      });
    } catch (error: any | string) {
      return next(new ErrorHandler(`an error accord ${error.message}`, 500));
    }
  }
);

/**
 * Delete a category from db
 * @param id for category
 */

export const destroy = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorHandler("wrong credential", 400));
      }
      const product = await productModel.findByIdAndDelete(id);
      if (!product) {
        return next(new ErrorHandler("product not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "product deleted successfully",
      });
    } catch (error: any | string) {
      return next(new ErrorHandler(`an error accord ${error.message}`, 500));
    }
  }
);
