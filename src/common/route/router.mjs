import { Router } from "express";
import stationRouter from "../../station/controller/stationController.mjs";
import policyRouter from "../../policy/controller/policyController.mjs";

import routeRouter from "../../route/controller/routeController.mjs";

const router = Router();

router.use(stationRouter);
router.use(policyRouter);
router.use(routeRouter);

export default router;
