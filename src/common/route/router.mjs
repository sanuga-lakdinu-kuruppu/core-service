import { Router } from "express";
import stationRouter from "../../station/controller/stationController.mjs";
import policyRouter from "../../policy/controller/policyController.mjs";

import routeRouter from "../../route/controller/routeController.mjs";
import busOperatorRouter from "../../busOperator/controller/busOperatorController.mjs";

import busWorkerRouter from "../../busWorker/controller/busWorkerController.mjs";

import vehicleRouter from "../../vehicle/controller/vehicleController.mjs";

import permitRouter from "../../permit/controller/permitController.mjs";

import scheduleRouter from "../../schedule/controller/scheduleController.mjs";
import authRouter from "../../authentication/auth.mjs";

const router = Router();

router.use(stationRouter);
router.use(policyRouter);
router.use(routeRouter);
router.use(busOperatorRouter);
router.use(vehicleRouter);
router.use(busWorkerRouter);
router.use(permitRouter);
router.use(scheduleRouter);
router.use(authRouter);

export default router;
