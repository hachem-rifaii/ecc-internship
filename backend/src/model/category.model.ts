import mongoose, { Schema, Document, Model } from "mongoose";

// Define the ICategory interface
export interface ICategory extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Category Schema
const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const categoryModel: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  CategorySchema
);
export default categoryModel;
