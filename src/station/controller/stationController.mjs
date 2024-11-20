import { Router } from "express";
import { createNewStation } from "../service/stationService.mjs";
import { generateShortUuid } from "../../common/util/unique.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { stationSchema } from "../schema/stationSchema.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/stations`,
  checkSchema(stationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      data.stationId = generateShortUuid();
      const createdStation = await createNewStation(data);
      return response.status(201).send(createdStation);
    } catch (error) {
      console.log(`station creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

export default router;
