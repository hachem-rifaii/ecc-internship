import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import orderModel from "../../model/order.model";
import productModel from "../../model/product.model";
import { catchAsyncError } from "../../middleware/catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";


export const index = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 10;
      let skip = (page - 1) * limit;

      const orders = await orderModel
        .find()
        .populate("products.product")
        .populate("customerId")
        .skip(skip)
        .limit(limit);

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



export const update = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params; 
  const { products, shippingAddress, paymentStatus, totalPrice } = req.body;

  if (!products || !shippingAddress || !paymentStatus || !totalPrice) {
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
    const order = await orderModel.findById(id).session(session);
    const oldQuantities = new Map();
    order?.products.forEach((item: any) => {
      oldQuantities.set(item.product.toString(), item.quantity);
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

 
    order.products = products;
    order.shippingAddress = shippingAddress;
    order.paymentStatus = paymentStatus;
    order.totalPrice = totalPrice;

  
    await order.save({ session });

    for (const item of products) {
      const oldQuantity = oldQuantities.get(item.product.toString()) || 0;
      const quantityDifference = item.quantity - oldQuantity;
      const product = productsInDB.find(
        (p) =>
          (p._id as mongoose.Types.ObjectId).toString() ===
          item.product.toString()
      );
      if (product) {
       
        await productModel.findByIdAndUpdate(
          product._id,
          { $inc: { quantity: -quantityDifference } },
          { session }
        );
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Order updated successfully.",
      order,
    });
  } catch (error: any | string) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while updating the order.",
      error: error.message,
    });
  }
});

export const show = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const exist_order = await orderModel
      .findById(id)
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

export const destroy = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const exist_order = await orderModel.findByIdAndDelete(id);
    if (!exist_order) {
      return next(new ErrorHandler("order not found", 404));
    }
    return res.status(200).json({
      message: "order deleted successfuly",
    });
  }
);
