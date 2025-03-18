import express from "express";

import { isAuthenticated } from "../middleware/auth";
import { createEvent, deleteEventById, getAllEvents, getEventById, updateEventById } from "../controller/event.controller";

const eventRouter = express.Router();

eventRouter.post("/", isAuthenticated, createEvent);
eventRouter.get("/", isAuthenticated, getAllEvents);
eventRouter.get("/:id", isAuthenticated, getEventById);
eventRouter.delete("/:id", isAuthenticated, deleteEventById);
eventRouter.put("/:id", isAuthenticated, updateEventById);

export default eventRouter;
