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

/**
 * @swagger
 * /core-service/v1.6/routes:
 *   post:
 *     summary: Create a new route
 *     tags:
 *       - Route
 *     description: Create a new route with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeNumber:
 *                 type: string
 *                 example: "ACB-43290"
 *               routeName:
 *                 type: string
 *                 example: "Colombo-Matara"
 *               travelDistance:
 *                 type: string
 *                 example: "56KM"
 *               travelDuration:
 *                 type: string
 *                 example: "1.5h"
 *               startStationId:
 *                 type: number
 *                 example: 55908702
 *               endStationId:
 *                 type: number
 *                 example: 55908702
 *     responses:
 *       201:
 *         description: Route creation success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeId:
 *                   type: number
 *                   example: 48105350
 *                 routeNumber:
 *                   type: string
 *                   example: "ACB-43290"
 *                 routeName:
 *                   type: string
 *                   example: "Colombo-Matara"
 *                 travelDistance:
 *                   type: string
 *                   example: "56KM"
 *                 travelDuration:
 *                   type: string
 *                   example: "1.5h"
 *                 startLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 endLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in input data.
 *       405:
 *         description: Method not allowed.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /core-service/v1.6/routes:
 *   get:
 *     summary: Retrieve all routes
 *     tags:
 *       - Route
 *     description: Retrieve a list of all available routes with their details.
 *     responses:
 *       200:
 *         description: A list of routes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   routeId:
 *                     type: number
 *                     example: 48105350
 *                   routeNumber:
 *                     type: string
 *                     example: "ACB-43290"
 *                   routeName:
 *                     type: string
 *                     example: "Colombo-Matara"
 *                   travelDistance:
 *                     type: string
 *                     example: "56KM"
 *                   travelDuration:
 *                     type: string
 *                     example: "1.5h"
 *                   startLocation:
 *                     type: object
 *                     properties:
 *                       coordinates:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                             example: 6.933549671456952
 *                           log:
 *                             type: number
 *                             example: 79.85550999641683
 *                       stationId:
 *                         type: number
 *                         example: 55908702
 *                       name:
 *                         type: string
 *                         example: "Matara"
 *                   endLocation:
 *                     type: object
 *                     properties:
 *                       coordinates:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                             example: 6.933549671456952
 *                           log:
 *                             type: number
 *                             example: 79.85550999641683
 *                       stationId:
 *                         type: number
 *                         example: 55908702
 *                       name:
 *                         type: string
 *                         example: "Matara"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-23T10:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-23T10:00:00Z"
 *       500:
 *         description: Internal server error.
 */
router.get(`${API_PREFIX}/routes`, async (request, response) => {
  try {
    const foundStations = await getAllRoutes();
    return response.send(foundStations);
  } catch (error) {
    console.log(`station getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

/**
 * @swagger
 * /core-service/v1.6/routes/{routeId}:
 *   get:
 *     summary: Retrieve a specific route by its ID
 *     tags:
 *       - Route
 *     description: Fetch the details of a specific route using its unique `routeId`.
 *     parameters:
 *       - name: routeId
 *         in: path
 *         required: true
 *         description: The unique identifier of the route.
 *         schema:
 *           type: number
 *           example: 48105350
 *     responses:
 *       200:
 *         description: Route details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeId:
 *                   type: number
 *                   example: 48105350
 *                 routeNumber:
 *                   type: string
 *                   example: "ACB-43290"
 *                 routeName:
 *                   type: string
 *                   example: "Colombo-Matara"
 *                 travelDistance:
 *                   type: string
 *                   example: "56KM"
 *                 travelDuration:
 *                   type: string
 *                   example: "1.5h"
 *                 startLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 endLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *       400:
 *         description: Bad request. The `routeId` is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, routeId should be a number"
 *       404:
 *         description: Route not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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

/**
 * @swagger
 * /core-service/v1.6/routes/routeNumber/{routeNumber}:
 *   get:
 *     summary: Retrieve a specific route by its route number
 *     tags:
 *       - Route
 *     description: Fetch the details of a specific route using its unique `routeNumber`.
 *     parameters:
 *       - name: routeNumber
 *         in: path
 *         required: true
 *         description: The unique identifier of the route as a string.
 *         schema:
 *           type: string
 *           example: "ACB-43290"
 *     responses:
 *       200:
 *         description: Route details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeId:
 *                   type: number
 *                   example: 48105350
 *                 routeNumber:
 *                   type: string
 *                   example: "ACB-43290"
 *                 routeName:
 *                   type: string
 *                   example: "Colombo-Matara"
 *                 travelDistance:
 *                   type: string
 *                   example: "56KM"
 *                 travelDuration:
 *                   type: string
 *                   example: "1.5h"
 *                 startLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 endLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *       400:
 *         description: Bad request. The `routeNumber` is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, routeNumber should be a String"
 *       404:
 *         description: Route not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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

/**
 * @swagger
 * /core-service/v1.6/routes/{routeId}:
 *   put:
 *     summary: Update a route by its ID
 *     tags:
 *       - Route
 *     description: Update the details of an existing route using its `routeId`.
 *     parameters:
 *       - name: routeId
 *         in: path
 *         required: true
 *         description: The unique identifier of the route.
 *         schema:
 *           type: number
 *           example: 48105350
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeNumber:
 *                 type: string
 *                 example: "ACB-43290"
 *               routeName:
 *                 type: string
 *                 example: "Colombo-Matara"
 *               travelDistance:
 *                 type: string
 *                 example: "56KM"
 *               travelDuration:
 *                 type: string
 *                 example: "1.5h"
 *               startStationId:
 *                 type: number
 *                 example: 55908702
 *               endStationId:
 *                 type: number
 *                 example: 55908702
 *     responses:
 *       200:
 *         description: Route updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeId:
 *                   type: number
 *                   example: 48105350
 *                 routeNumber:
 *                   type: string
 *                   example: "ACB-43290"
 *                 routeName:
 *                   type: string
 *                   example: "Colombo-Matara"
 *                 travelDistance:
 *                   type: string
 *                   example: "56KM"
 *                 travelDuration:
 *                   type: string
 *                   example: "1.5h"
 *                 startLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 endLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T11:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in input data or invalid `routeId`.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, routeId should be a number"
 *       404:
 *         description: Route not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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

/**
 * @swagger
 * /core-service/v1.6/routes/{routeId}:
 *   delete:
 *     summary: Delete a route by its ID
 *     tags:
 *       - Route
 *     description: Delete a route by its unique `routeId`.
 *     parameters:
 *       - name: routeId
 *         in: path
 *         required: true
 *         description: The unique identifier of the route.
 *         schema:
 *           type: number
 *           example: 48105350
 *     responses:
 *       200:
 *         description: Route deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeId:
 *                   type: number
 *                   example: 48105350
 *                 routeNumber:
 *                   type: string
 *                   example: "ACB-43290"
 *                 routeName:
 *                   type: string
 *                   example: "Colombo-Matara"
 *                 travelDistance:
 *                   type: string
 *                   example: "56KM"
 *                 travelDuration:
 *                   type: string
 *                   example: "1.5h"
 *                 startLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 endLocation:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 6.933549671456952
 *                         log:
 *                           type: number
 *                           example: 79.85550999641683
 *                     stationId:
 *                       type: number
 *                       example: 55908702
 *                     name:
 *                       type: string
 *                       example: "Matara"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T11:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in input data or invalid `routeId`.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, routeId should be a number"
 *       404:
 *         description: Route not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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
