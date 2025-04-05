import mongoose, { Schema, Document, Model } from "mongoose";

// Define the IProduct interface
export interface IProduct extends Document {
  name: string;
  price: number;
  discount_price?: number;
  description: string;
  quantity: number;
  image?: string;
  categoryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Create the Product Schema
const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount_price: {
      type: Number,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: true, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);
export default productModel;
