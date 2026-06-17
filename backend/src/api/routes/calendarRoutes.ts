import express, { Router } from "express";
import * as calendarController from "../controllers/calendarController";

const router = Router();
const jsonParser = express.json();

router.get("/calendar/family/:id", calendarController.getCalendarForFamily);
router.get("/calendar/:id", calendarController.getCalendar);

export default router;
