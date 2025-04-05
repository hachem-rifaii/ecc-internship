import { Request, Response, NextFunction } from "express";
import categoryModel, { ICategory } from "../../model/category.model";
import ErrorHandler from "../../utils/ErrorHandler";
import { catchAsyncError } from "../../middleware/catchAsyncErrors";
import mongoose from "mongoose";

/**
 * @accpet page & limit
 * @return paginate category from db
 */
export const index = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 5;
      let skip = (page - 1) * limit;

      const categories = await categoryModel.find().skip(skip).limit(limit);

      const totalCategories = await categoryModel.countDocuments();

      return res.status(200).json({
        success: true,
        totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
        categories,
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
      const { name, description, isActive } = req.body as ICategory;
      const isNameExist = await categoryModel.findOne({ name });
      if (isNameExist) {
        return next(new ErrorHandler("Name already exists", 400));
      }
      const newCategory = await categoryModel.create({
        name,
        description,
        isActive,
      });
      return res.status(201).json({
        message: "Category created successfuly",
        category: newCategory,
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
      const { name, description, isActive } = req.body as ICategory;

      const updatedCategory = await categoryModel.findByIdAndUpdate(
        id,
        { name, description, isActive },
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return next(new ErrorHandler("Category not found", 404));
      }

      return res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory, // ✅ الآن يُرجع الفئة بعد التحديث
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
      const category = await categoryModel.findById(id);
      if (!category) {
        return next(new ErrorHandler("category not found", 404));
      }

      return res.status(200).json({
        category,
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
      const category = await categoryModel.findByIdAndDelete(id);
      if (!category) {
        return next(new ErrorHandler("category not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error: any | string) {
      return next(new ErrorHandler(`an error accord ${error.message}`, 500));
    }
  }
);
