import mongoose, { Document, Model, Schema } from "mongoose";
import { Types } from 'mongoose';

export interface IEvent extends Document {
  title: string; 
  start: Date; 
  description?: string; 
  color?: string; 
  createdBy?: Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date; 
}

const eventSchema = new Schema<IEvent> ({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    description: { type: String },
    color: { type: String, default: '#3788d8' }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
})

const eventModel: Model<IEvent> = mongoose.model<IEvent>("Event", eventSchema);

export default eventModel;