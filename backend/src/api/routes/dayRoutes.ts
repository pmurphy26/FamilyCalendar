import express, { Router } from "express";
import * as daysController from "../controllers/daysController";

const router = Router();
const jsonParser = express.json();

router.get("/day/:id", daysController.getCalendarDayWithID);
router.get("/days/:id", daysController.getCalendarDaysWithID);
router.post("/days", jsonParser, daysController.createCalendarDay);

export default router;
