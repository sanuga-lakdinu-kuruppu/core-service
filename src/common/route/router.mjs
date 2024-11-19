import { Router } from "express";
import stationRouter from "../../station/controller/stationController.mjs";

const router = Router();

router.use(stationRouter);

export default router;
