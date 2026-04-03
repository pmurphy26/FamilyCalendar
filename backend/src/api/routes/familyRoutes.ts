import express, { Router } from "express";
import * as familyController from "../controllers/familyController";

const router = Router();
const jsonParser = express.json();

router.get("/family/:id", familyController.getFamily);

export default router;
