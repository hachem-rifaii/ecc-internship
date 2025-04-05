import { Request, Response, NextFunction } from "express";

import orderModel from "../../model/order.model";

import { catchAsyncError } from "../../middleware/catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";
import productModel from "../../model/product.model";
import mongoose from "mongoose";

export const index = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 10;
      let skip = (page - 1) * limit;
      const userId = req.user.id;
      if (!userId) {
        return next(new ErrorHandler("you are not authenticated", 401));
      }

      const orders = await orderModel
        .find({
          customerId: userId,
        })
        .populate("products.product")
        .populate("customerId")
        .skip(skip)
        .limit(limit);

      if (!orders) {
        return next(new ErrorHandler("wrong order", 404));
      }
      const totalOrders = await orderModel.countDocuments();

      return res.status(200).json({
        success: true,
        orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
      });
    } catch (error: any | string) {
      return next(new ErrorHandler("an error accord" + error.message, 500));
    }
  }
);

export const create = catchAsyncError(async (req: Request, res: Response) => {
  const { products, shippingAddress, paymentStatus, totalPrice } = req.body;

  const customerId = req.user.id;
  if (!customerId) {
    return res.status(401).json({ message: "User not authenticated." });
  }
  if (
    !products ||
    !customerId ||
    !shippingAddress ||
    !paymentStatus ||
    !totalPrice
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const productIds = products.map(
    (item: { product: mongoose.Types.ObjectId }) => item.product
  );
  const productsInDB = await productModel.find({ _id: { $in: productIds } });

  if (productsInDB.length !== productIds.length) {
    return res.status(404).json({ message: "Some products are not found." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newOrder = new orderModel({
      products,
      customerId,
      shippingAddress,
      paymentStatus,
      totalPrice,
    });

    await newOrder.save({ session });

    for (const item of products) {
      const product = productsInDB.find(
        (p) =>
          (p._id as mongoose.Types.ObjectId).toString() ===
          item.product.toString()
      );
      if (product) {
        await productModel.findByIdAndUpdate(
          product._id,
          { $inc: { quantity: -item.quantity } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order created successfully.",
      order: newOrder,
    });
  } catch (error: any | string) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while creating the order.",
      error: error.message,
    });
  }
});

export const show = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user.id;
    if (!userId) {
      return next(new ErrorHandler("you are not authenticated", 401));
    }
    const exist_order = await orderModel
      .find({
        $and: [{ _id: id }, { customerId: userId }],
      })
      .populate("products.product")
      .populate("customerId");
    if (!exist_order) {
      return next(new ErrorHandler("Order not Found", 404));
    }
    return res.status(200).json({
      order: exist_order,
    });
  }
);
