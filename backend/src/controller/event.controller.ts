require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import eventModel, { IEvent } from "../model/event.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
// import { ObjectId, Types } from "mongoose";

// create a new event
export const createEvent = catchAsyncError(
  async (req: Request, res: Response) => {
    const event: IEvent = new eventModel({
      title: req.body.title,
      start: req.body.start,
      description: req.body.description,
      color: req.body.color,
      createdBy: req?.user?._id,  
    });

    const newEvent = await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  }
);


// get all events
export const getAllEvents = catchAsyncError(
  async (req: Request, res: Response) => {
    const events = await eventModel.find({ createdBy: req?.user?._id });
     if(!events){
        return new ErrorHandler("No events found", 404);
     }
    res.json({
      success: true,
      data: events,
    });
  }
);

// get single event by id
export const getEventById = catchAsyncError(
  async (req: Request, res: Response) => {
    const event = await eventModel.findById(req.params.id);

    if (!event) {
     return new ErrorHandler("Event not found", 404);
    }

    res.json({
      success: true,
      data: event,
    });
  }
);

// update event by id
export const updateEventById = catchAsyncError(
  async (req: Request, res: Response) => {
    const updatedEvent = await eventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
        return new ErrorHandler("Event not found", 404);
    }

    res.json({
      success: true,
      data: updatedEvent,
    });
  }
);

// delete event by id
export const deleteEventById = catchAsyncError(
  async (req: Request, res: Response) => {
    const deletedEvent = await eventModel.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
        return new ErrorHandler("Event not found", 404);
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  }
);
