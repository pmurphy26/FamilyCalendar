import { Router } from "express";
import * as familyController from "../controllers/familyController";

const router = Router();

router.get("/family/:id", familyController.getFamily);
router.post("/family", familyController.createFamily);

export default router;
