import express, { Router } from "express";
import * as eventsController from "../controllers/eventsController";

const router = Router();
const jsonParser = express.json();

router.get("/events/:id", eventsController.getEvent);
router.get("/events/day/:id", eventsController.getEventsForDay);
router.post("/events/add", jsonParser, eventsController.addEvents);
//router.delete("/comments/:id", eventsController.deleteComment);
router.post("/event/edit", jsonParser, eventsController.updateEvent);

export default router;
