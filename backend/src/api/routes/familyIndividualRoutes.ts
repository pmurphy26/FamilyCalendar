import express, { Router } from "express";
import * as familyIndividualsController from "../controllers/familyIndividualsController";

const router = Router();
const jsonParser = express.json();

router.post(
  "/familyIndividual/delete/:id",
  familyIndividualsController.deleteFamilyIndividual,
);
router.post(
  "/familyIndividual/update",
  jsonParser,
  familyIndividualsController.updateFamilyIndividual,
);
router.post(
  "/familyIndividual/:id",
  jsonParser,
  familyIndividualsController.createFamilyIndividual,
);

export default router;
