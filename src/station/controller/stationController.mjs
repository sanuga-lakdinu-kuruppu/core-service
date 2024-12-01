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

/**
 * @swagger
 * /core-service/v2.0/stations:
 *   post:
 *     summary: Create a new station
 *     tags:
 *       - Station
 *     description: Create a new station with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Colombo Bus Station"
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 6.9335635889865594
 *                   log:
 *                     type: number
 *                     example: 79.85550871384882
 *     responses:
 *       201:
 *         description: Station creation success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stationId:
 *                   type: number
 *                   example: 35840964
 *                 name:
 *                   type: string
 *                   example: "Colombo Bus Station"
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       example: 6.9335635889865594
 *                     log:
 *                       type: number
 *                       example: 79.85550871384882
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

/**
 * @swagger
 * /core-service/v2.0/stations:
 *   get:
 *     summary: Retrieve all stations
 *     tags:
 *       - Station
 *     description: Retrieve a list of all stations, optionally filtered by `name`.
 *     parameters:
 *       - name: name
 *         in: query
 *         description: The name of the station to filter by (optional).
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: "Colombo"
 *     responses:
 *       200:
 *         description: A list of stations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stationId:
 *                     type: number
 *                     example: 35840964
 *                   name:
 *                     type: string
 *                     example: "Colombo Bus Station"
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                         example: 6.9335635889865594
 *                       log:
 *                         type: number
 *                         example: 79.85550871384882
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-23T10:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-23T10:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "name must be a string"
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "method not allowed"
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

/**
 * @swagger
 * /core-service/v2.0/stations/{stationId}:
 *   get:
 *     summary: Retrieve a station by its ID
 *     tags:
 *       - Station
 *     description: Retrieve a specific station by its ID.
 *     parameters:
 *       - name: stationId
 *         in: path
 *         description: The ID of the station to retrieve.
 *         required: true
 *         schema:
 *           type: number
 *           example: 35840964
 *     responses:
 *       200:
 *         description: The station was found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stationId:
 *                   type: number
 *                   example: 35840964
 *                 name:
 *                   type: string
 *                   example: "Colombo Bus Station"
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       example: 6.9335635889865594
 *                     log:
 *                       type: number
 *                       example: 79.85550871384882
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, stationId should be a number"
 *       404:
 *         description: Resource not found. The station with the given ID does not exist.
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

/**
 * @swagger
 * /core-service/v2.0/stations/{stationId}:
 *   put:
 *     summary: Update a station by its ID
 *     tags:
 *       - Station
 *     description: Update the details of an existing station using its ID.
 *     parameters:
 *       - name: stationId
 *         in: path
 *         description: The ID of the station to update.
 *         required: true
 *         schema:
 *           type: number
 *           example: 35840964
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Colombo Bus Station"
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 6.9335635889865594
 *                   log:
 *                     type: number
 *                     example: 79.85550871384882
 *     responses:
 *       200:
 *         description: The station was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stationId:
 *                   type: number
 *                   example: 35840964
 *                 name:
 *                   type: string
 *                   example: "Colombo Bus Station"
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       example: 6.9335635889865594
 *                     log:
 *                       type: number
 *                       example: 79.85550871384882
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "name must be a string"
 *       404:
 *         description: Resource not found. The station with the given ID does not exist.
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

/**
 * @swagger
 * /core-service/v2.0/stations/{stationId}:
 *   delete:
 *     summary: Delete a station by its ID
 *     tags:
 *       - Station
 *     description: Delete an existing station using its ID.
 *     parameters:
 *       - name: stationId
 *         in: path
 *         description: The ID of the station to delete.
 *         required: true
 *         schema:
 *           type: number
 *           example: 35840964
 *     responses:
 *       200:
 *         description: The station was deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stationId:
 *                   type: number
 *                   example: 35840964
 *                 name:
 *                   type: string
 *                   example: "Colombo Bus Station"
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       example: 6.9335635889865594
 *                     log:
 *                       type: number
 *                       example: 79.85550871384882
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, stationId should be a number"
 *       404:
 *         description: Resource not found. The station with the given ID does not exist.
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
