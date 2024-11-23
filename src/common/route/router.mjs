import { Router } from "express";
import stationRouter from "../../station/controller/stationController.mjs";
import policyRouter from "../../policy/controller/policyController.mjs";

const router = Router();

router.use(stationRouter);
router.use(policyRouter);

export default router;
