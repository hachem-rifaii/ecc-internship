import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrder extends Document {
  products: { product: mongoose.Schema.Types.ObjectId; quantity: number }[]; // Use Schema.Types.ObjectId here
  totalPrice: number;
  customerId: mongoose.Schema.Types.ObjectId; // Use Schema.Types.ObjectId here
  shippingAddress: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // Corrected here
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Corrected here
    shippingAddress: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    orderStatus: { type: String, required: true, default: "processing" },
  },
  {
    timestamps: true,
  }
);

const orderModel: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default orderModel;
