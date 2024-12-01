import { Router } from "express";
import { generateShortUuid } from "../../common/util/unique.mjs";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import { scheduleSchema } from "../schema/scheduleSchema.mjs";
import {
  createNewSchedule,
  getAllSchedules,
  getScheduleById,
  deleteScheduleById,
} from "../service/scheduleService.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

/**
 * @swagger
 * /core-service/v2.0/schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags:
 *       - Schedule
 *     description: Creates a new schedule in the system using the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departureTime:
 *                 type: string
 *                 example: "01:30"
 *               arrivalTime:
 *                 type: string
 *                 example: "10:00"
 *               startLocation:
 *                 type: number
 *                 example: 55908702
 *               endLocation:
 *                 type: number
 *                 example: 55908702
 *               route:
 *                 type: number
 *                 example: 22706966
 *               permit:
 *                 type: number
 *                 example: 49299161
 *     responses:
 *       201:
 *         description: Schedule successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scheduleId:
 *                   type: number
 *                   example: 45717684
 *                 departureTime:
 *                   type: string
 *                   example: "01:30"
 *                 arrivalTime:
 *                   type: string
 *                   example: "10:00"
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
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeId:
 *                       type: number
 *                       example: 22706966
 *                     routeNumber:
 *                       type: string
 *                       example: "ACB-43290"
 *                 permit:
 *                   type: object
 *                   properties:
 *                     permitId:
 *                       type: number
 *                       example: 49299161
 *                     permitNumber:
 *                       type: string
 *                       example: "PERMIT-2024-0003"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T07:36:44.827Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T07:36:44.827Z"
 *       400:
 *         description: Bad request. Validation errors or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid schedule data"
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
router.post(
  `${API_PREFIX}/schedules`,
  checkSchema(scheduleSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      data.scheduleId = generateShortUuid();
      const createdSchedule = await createNewSchedule(data);
      return response.status(201).send(createdSchedule);
    } catch (error) {
      console.log(`schedule creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/schedules:
 *   get:
 *     summary: Get all schedules
 *     tags:
 *       - Schedule
 *     description: Retrieves all schedules from the system.
 *     responses:
 *       200:
 *         description: A list of schedules retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   scheduleId:
 *                     type: number
 *                     example: 45717684
 *                   departureTime:
 *                     type: string
 *                     example: "01:30"
 *                   arrivalTime:
 *                     type: string
 *                     example: "10:00"
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
 *                   route:
 *                     type: object
 *                     properties:
 *                       routeId:
 *                         type: number
 *                         example: 22706966
 *                       routeNumber:
 *                         type: string
 *                         example: "ACB-43290"
 *                   permit:
 *                     type: object
 *                     properties:
 *                       permitId:
 *                         type: number
 *                         example: 49299161
 *                       permitNumber:
 *                         type: string
 *                         example: "PERMIT-2024-0003"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-01T07:36:44.827Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-01T07:36:44.827Z"
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
router.get(`${API_PREFIX}/schedules`, async (request, response) => {
  try {
    const foundSchedules = await getAllSchedules();
    return response.send(foundSchedules);
  } catch (error) {
    console.log(`schedule getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

/**
 * @swagger
 * /core-service/v2.0/schedules/{scheduleId}:
 *   get:
 *     summary: Get a schedule by ID
 *     tags:
 *       - Schedule
 *     description: Retrieves a specific schedule by its scheduleId.
 *     parameters:
 *       - name: scheduleId
 *         in: path
 *         required: true
 *         description: The unique identifier for the schedule.
 *         schema:
 *           type: integer
 *           example: 91887633
 *     responses:
 *       200:
 *         description: The schedule was found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scheduleId:
 *                   type: number
 *                   example: 91887633
 *                 departureTime:
 *                   type: string
 *                   example: "01:30"
 *                 arrivalTime:
 *                   type: string
 *                   example: "10:00"
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
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeId:
 *                       type: number
 *                       example: 22706966
 *                     routeNumber:
 *                       type: string
 *                       example: "ACB-43290"
 *                 permit:
 *                   type: object
 *                   properties:
 *                     permitId:
 *                       type: number
 *                       example: 49299161
 *                     permitNumber:
 *                       type: string
 *                       example: "PERMIT-2024-0003"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T07:57:25.729Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T07:57:25.729Z"
 *       400:
 *         description: Bad request. The scheduleId should be a number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, scheduleId should be a number"
 *       404:
 *         description: Schedule not found.
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
  `${API_PREFIX}/schedules/:scheduleId`,
  param("scheduleId")
    .isNumeric()
    .withMessage("bad request, scheduleId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { scheduleId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundSchedule = await getScheduleById(scheduleId);
      if (foundSchedule) return response.send(foundSchedule);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`schedule getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/schedules/{scheduleId}:
 *   delete:
 *     summary: Delete a schedule by ID
 *     tags:
 *       - Schedule
 *     description: Deletes a specific schedule by its scheduleId.
 *     parameters:
 *       - name: scheduleId
 *         in: path
 *         required: true
 *         description: The unique identifier for the schedule to be deleted.
 *         schema:
 *           type: integer
 *           example: 91887633
 *     responses:
 *       200:
 *         description: The schedule was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scheduleId:
 *                   type: number
 *                   example: 91887633
 *                 departureTime:
 *                   type: string
 *                   example: "01:30"
 *                 arrivalTime:
 *                   type: string
 *                   example: "10:00"
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
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeId:
 *                       type: number
 *                       example: 22706966
 *                     routeNumber:
 *                       type: string
 *                       example: "ACB-43290"
 *                 permit:
 *                   type: object
 *                   properties:
 *                     permitId:
 *                       type: number
 *                       example: 49299161
 *                     permitNumber:
 *                       type: string
 *                       example: "PERMIT-2024-0003"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T07:57:25.729Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T07:57:25.729Z"
 *       400:
 *         description: Bad request. The scheduleId should be a number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, scheduleId should be a number"
 *       404:
 *         description: Schedule not found. The schedule with the provided scheduleId was not found.
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
  `${API_PREFIX}/schedules/:scheduleId`,
  param("scheduleId")
    .isNumeric()
    .withMessage("bad request, scheduleId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { scheduleId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedSchedule = await deleteScheduleById(scheduleId);
      if (!deletedSchedule)
        return response.status(404).send({ error: "resource not found" });
      console.log(`schedule deleted successfully`);
      return response.send(deletedSchedule);
    } catch (error) {
      console.log(`schedule deleting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/schedules*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
