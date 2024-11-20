import { response, Router } from "express";
import {
  createNewStation,
  deleteStationById,
  getAllStations,
  getStationById,
  updateStationById,
} from "../service/stationService.mjs";
import { generateShortUuid } from "../../common/util/unique.mjs";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
  query,
} from "express-validator";
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

router.get(
  `${API_PREFIX}/stations`,
  query("name")
    .optional()
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 1, max: 50 })
    .withMessage("name must be between 1 and 50 characters"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const {
        query: { name },
      } = request;
      const filter = name ? { name: new RegExp(name, "i") } : {};
      const foundStations = await getAllStations(filter);
      return response.send(foundStations);
    } catch (error) {
      console.log(`station getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(
  `${API_PREFIX}/stations/:stationId`,
  param("stationId")
    .isNumeric()
    .withMessage("bad request, stationId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { stationId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundStation = await getStationById(stationId);
      if (foundStation) return response.send(foundStation);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`station getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.put(
  `${API_PREFIX}/stations/:stationId`,
  param("stationId")
    .isNumeric()
    .withMessage("bad request, stationId should be a number"),
  checkSchema(stationSchema),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { stationId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const updatedStation = await updateStationById(stationId, data);
      if (!updatedStation)
        return response.status(404).send({ error: "resource not found" });
      console.log(`station updated successfully`);
      return response.send(updatedStation);
    } catch (error) {
      console.log(`station getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.delete(
  `${API_PREFIX}/stations/:stationId`,
  param("stationId")
    .isNumeric()
    .withMessage("bad request, stationId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { stationId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedStation = await deleteStationById(stationId);
      if (!deletedStation)
        return response.status(404).send({ error: "resource not found" });
      console.log(`station deleted successfully`);
      return response.send(deletedStation);
    } catch (error) {
      console.log(`station getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/stations*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
