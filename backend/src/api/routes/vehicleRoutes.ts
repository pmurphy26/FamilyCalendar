import express, { Router } from "express";
import * as vehiclesController from "../controllers/vehiclesController";

const router = Router();
const jsonParser = express.json();

router.post("/vehicle/delete/:id", vehiclesController.deleteFamilyIndividual);
router.post(
  "/vehicle/update",
  jsonParser,
  vehiclesController.updateFamilyVehicle,
);
router.post("/vehicle/:id", jsonParser, vehiclesController.createFamilyVehicle);

export default router;
