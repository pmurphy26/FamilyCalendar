import express, { Router } from "express";
import * as transportationController from "../controllers/transportationController";

const router = Router();
const jsonParser = express.json();

router.get("/transportation/:id", transportationController.getTransportation);
//router.get("/events/day/:id", transportationController.getEventsForDay);
router.post(
  "/transportation/add",
  jsonParser,
  transportationController.addTransportations,
);
//router.delete("/comments/:id", eventsController.deleteComment);
router.post(
  "/transportation/edit",
  jsonParser,
  transportationController.updateTransportation,
);

export default router;
