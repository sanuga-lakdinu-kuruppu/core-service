import { response, Router } from "express";
import { generateShortUuid } from "../../common/util/unique.mjs";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import {
  createNewRoute,
  getAllRoutes,
  getRouteById,
  getRouteByNumber,
  deleteRouteById,
  updateRouteById,
} from "../service/routeService.mjs";

import { routeSchema } from "../schema/routeSchema.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/routes`,
  checkSchema(routeSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      data.routeId = generateShortUuid();
      const createdRoute = await createNewRoute(data);
      return response.status(201).send(createdRoute);
    } catch (error) {
      console.log(`route creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(`${API_PREFIX}/routes`, async (request, response) => {
  try {
    const foundStations = await getAllRoutes();
    return response.send(foundStations);
  } catch (error) {
    console.log(`station getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

router.get(
  `${API_PREFIX}/routes/:routeId`,
  param("routeId")
    .isNumeric()
    .withMessage("bad request, routeId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { routeId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundRoute = await getRouteById(routeId);
      if (foundRoute) return response.send(foundRoute);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`route getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(
  `${API_PREFIX}/routes/routeNumber/:routeNumber`,
  param("routeNumber")
    .isString()
    .withMessage("bad request, routeNumber should be a String")
    .isLength({ max: 50 })
    .withMessage("routeNumber must be less than 50 characters"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { routeNumber },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundRoute = await getRouteByNumber(routeNumber);
      if (foundRoute) return response.send(foundRoute);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`route getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.put(
  `${API_PREFIX}/routes/:routeId`,
  param("routeId")
    .isNumeric()
    .withMessage("bad request, routeId should be a number"),
  checkSchema(routeSchema),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { routeId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const updatedRoute = await updateRouteById(routeId, data);
      if (!updatedRoute)
        return response.status(404).send({ error: "resource not found" });
      console.log(`route updated successfully`);
      return response.send(updatedRoute);
    } catch (error) {
      console.log(`route updated error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.delete(
  `${API_PREFIX}/routes/:routeId`,
  param("routeId")
    .isNumeric()
    .withMessage("bad request, routeId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { routeId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedRoute = await deleteRouteById(routeId);
      if (!deletedRoute)
        return response.status(404).send({ error: "resource not found" });
      console.log(`route deleted successfully`);
      return response.send(deletedRoute);
    } catch (error) {
      console.log(`route deleting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/routes*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
