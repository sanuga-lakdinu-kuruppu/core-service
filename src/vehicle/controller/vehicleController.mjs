import { response, Router } from "express";
import { generateShortUuid } from "../../common/util/unique.mjs";
import {
  createNewVehicle,
  getAllVehicles,
  getVehicleByRegistrationNumber,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
} from "../service/vehicleService.mjs";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import { vehicleSchema } from "../schema/vehicleShema.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

/**
 * @swagger
 * /core-service/v1.9/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags:
 *       - Vehicle
 *     description: Create a new vehicle with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "ABC12345"
 *               model:
 *                 type: string
 *                 example: "Volvo 960"
 *               capacity:
 *                 type: number
 *                 example: 50
 *               type:
 *                 type: string
 *                 example: "Luxury"
 *               status:
 *                 type: string
 *                 example: "ACTIVE"
 *               airCondition:
 *                 type: boolean
 *                 example: true
 *               adjustableSeats:
 *                 type: boolean
 *                 example: true
 *               chargingCapability:
 *                 type: boolean
 *                 example: false
 *               restStops:
 *                 type: boolean
 *                 example: true
 *               movie:
 *                 type: boolean
 *                 example: false
 *               music:
 *                 type: boolean
 *                 example: true
 *               cupHolder:
 *                 type: boolean
 *                 example: true
 *               emergencyExit:
 *                 type: boolean
 *                 example: true
 *               pricePerSeat:
 *                 type: number
 *                 example: 7500
 *               bookingClose:
 *                 type: number
 *                 example: 2
 *               cancellationPolicyId:
 *                 type: number
 *                 example: 76930122
 *               busOperatorId:
 *                 type: number
 *                 example: 101
 *     responses:
 *       201:
 *         description: Vehicle creation success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicleId:
 *                   type: number
 *                   example: 54395929
 *                 registrationNumber:
 *                   type: string
 *                   example: "ABC12345"
 *                 model:
 *                   type: string
 *                   example: "Volvo 960"
 *                 capacity:
 *                   type: number
 *                   example: 50
 *                 type:
 *                   type: string
 *                   example: "Luxury"
 *                 status:
 *                   type: string
 *                   example: "ACTIVE"
 *                 airCondition:
 *                   type: boolean
 *                   example: true
 *                 adjustableSeats:
 *                   type: boolean
 *                   example: true
 *                 chargingCapability:
 *                   type: boolean
 *                   example: false
 *                 restStops:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   type: boolean
 *                   example: false
 *                 music:
 *                   type: boolean
 *                   example: true
 *                 cupHolder:
 *                   type: boolean
 *                   example: true
 *                 emergencyExit:
 *                   type: boolean
 *                   example: true
 *                 pricePerSeat:
 *                   type: number
 *                   example: 7500
 *                 bookingClose:
 *                   type: number
 *                   example: 2
 *                 cancellationPolicy:
 *                   type: object
 *                   properties:
 *                     policyId:
 *                       type: number
 *                       example: 76930122
 *                     policyName:
 *                       type: string
 *                       example: "First Payment Policy"
 *                 busOperator:
 *                   type: object
 *                   properties:
 *                     operatorId:
 *                       type: number
 *                       example: 101
 *                     company:
 *                       type: string
 *                       example: "SuperBus Services"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *       400:
 *         description: Bad request. Validation errors in input data.
 *       405:
 *         description: Method not allowed.
 *       500:
 *         description: Internal server error.
 */
router.post(
  `${API_PREFIX}/vehicles`,
  checkSchema(vehicleSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      data.vehicleId = generateShortUuid();
      const createdVehicle = await createNewVehicle(data);
      return createdVehicle
        ? response.status(201).send(createdVehicle)
        : response.status(500).send({ error: "internal server error" });
    } catch (error) {
      console.log(`vehicle creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.9/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags:
 *       - Vehicle
 *     description: Retrieve a list of all available vehicles with their details.
 *     responses:
 *       200:
 *         description: A list of vehicles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehicleId:
 *                     type: number
 *                     example: 54395929
 *                   registrationNumber:
 *                     type: string
 *                     example: "ABC12345"
 *                   model:
 *                     type: string
 *                     example: "Volvo 960"
 *                   capacity:
 *                     type: number
 *                     example: 50
 *                   type:
 *                     type: string
 *                     example: "Luxury"
 *                   status:
 *                     type: string
 *                     example: "ACTIVE"
 *                   airCondition:
 *                     type: boolean
 *                     example: true
 *                   adjustableSeats:
 *                     type: boolean
 *                     example: true
 *                   chargingCapability:
 *                     type: boolean
 *                     example: false
 *                   restStops:
 *                     type: boolean
 *                     example: true
 *                   movie:
 *                     type: boolean
 *                     example: false
 *                   music:
 *                     type: boolean
 *                     example: true
 *                   cupHolder:
 *                     type: boolean
 *                     example: true
 *                   emergencyExit:
 *                     type: boolean
 *                     example: true
 *                   pricePerSeat:
 *                     type: number
 *                     example: 7500
 *                   bookingClose:
 *                     type: number
 *                     example: 2
 *                   cancellationPolicy:
 *                     type: object
 *                     properties:
 *                       policyId:
 *                         type: number
 *                         example: 76930122
 *                       policyName:
 *                         type: string
 *                         example: "First Payment Policy"
 *                   busOperator:
 *                     type: object
 *                     properties:
 *                       operatorId:
 *                         type: number
 *                         example: 29239246
 *                       company:
 *                         type: string
 *                         example: "SuperBus Services"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-24T11:42:17.970Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-24T11:42:17.970Z"
 *       500:
 *         description: Internal server error.
 */
router.get(`${API_PREFIX}/vehicles`, async (request, response) => {
  try {
    const foundVehicles = await getAllVehicles();
    return response.send(foundVehicles);
  } catch (error) {
    console.log(`vehicle getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

/**
 * @swagger
 * /core-service/v1.9/vehicles/registrationNumber/{registrationNumber}:
 *   get:
 *     summary: Get a vehicle by its registration number
 *     tags:
 *       - Vehicle
 *     description: Retrieve a specific vehicle's details using its registration number.
 *     parameters:
 *       - in: path
 *         name: registrationNumber
 *         required: true
 *         description: The unique registration number of the vehicle.
 *         schema:
 *           type: string
 *           example: "ABC12345"
 *     responses:
 *       200:
 *         description: Vehicle details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicleId:
 *                   type: number
 *                   example: 54395929
 *                 registrationNumber:
 *                   type: string
 *                   example: "ABC12345"
 *                 model:
 *                   type: string
 *                   example: "Volvo 960"
 *                 capacity:
 *                   type: number
 *                   example: 50
 *                 type:
 *                   type: string
 *                   example: "Luxury"
 *                 status:
 *                   type: string
 *                   example: "ACTIVE"
 *                 airCondition:
 *                   type: boolean
 *                   example: true
 *                 adjustableSeats:
 *                   type: boolean
 *                   example: true
 *                 chargingCapability:
 *                   type: boolean
 *                   example: false
 *                 restStops:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   type: boolean
 *                   example: false
 *                 music:
 *                   type: boolean
 *                   example: true
 *                 cupHolder:
 *                   type: boolean
 *                   example: true
 *                 emergencyExit:
 *                   type: boolean
 *                   example: true
 *                 pricePerSeat:
 *                   type: number
 *                   example: 7500
 *                 bookingClose:
 *                   type: number
 *                   example: 2
 *                 cancellationPolicy:
 *                   type: object
 *                   properties:
 *                     policyId:
 *                       type: number
 *                       example: 76930122
 *                     policyName:
 *                       type: string
 *                       example: "First Payment Policy"
 *                 busOperator:
 *                   type: object
 *                   properties:
 *                     operatorId:
 *                       type: number
 *                       example: 29239246
 *                     company:
 *                       type: string
 *                       example: "SuperBus Services"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *       400:
 *         description: Bad request due to invalid registration number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, registrationNumber should be a String"
 *       404:
 *         description: Vehicle not found.
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
  `${API_PREFIX}/vehicles/registrationNumber/:registrationNumber`,
  param("registrationNumber")
    .isString()
    .withMessage("bad request, registrationNumber should be a String")
    .isLength({ max: 50 })
    .withMessage("registrationNumber must be less than 50 characters"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { registrationNumber },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundVehicle = await getVehicleByRegistrationNumber(
        registrationNumber
      );
      if (foundVehicle) return response.send(foundVehicle);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`vehicle getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.9/vehicles/{vehicleId}:
 *   get:
 *     summary: Get a vehicle by its ID
 *     tags:
 *       - Vehicle
 *     description: Retrieve a specific vehicle's details using its ID.
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         description: The unique ID of the vehicle.
 *         schema:
 *           type: integer
 *           example: 54395929
 *     responses:
 *       200:
 *         description: Vehicle details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicleId:
 *                   type: number
 *                   example: 54395929
 *                 registrationNumber:
 *                   type: string
 *                   example: "ABC12345"
 *                 model:
 *                   type: string
 *                   example: "Volvo 960"
 *                 capacity:
 *                   type: number
 *                   example: 50
 *                 type:
 *                   type: string
 *                   example: "Luxury"
 *                 status:
 *                   type: string
 *                   example: "ACTIVE"
 *                 airCondition:
 *                   type: boolean
 *                   example: true
 *                 adjustableSeats:
 *                   type: boolean
 *                   example: true
 *                 chargingCapability:
 *                   type: boolean
 *                   example: false
 *                 restStops:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   type: boolean
 *                   example: false
 *                 music:
 *                   type: boolean
 *                   example: true
 *                 cupHolder:
 *                   type: boolean
 *                   example: true
 *                 emergencyExit:
 *                   type: boolean
 *                   example: true
 *                 pricePerSeat:
 *                   type: number
 *                   example: 7500
 *                 bookingClose:
 *                   type: number
 *                   example: 2
 *                 cancellationPolicy:
 *                   type: object
 *                   properties:
 *                     policyId:
 *                       type: number
 *                       example: 76930122
 *                     policyName:
 *                       type: string
 *                       example: "First Payment Policy"
 *                 busOperator:
 *                   type: object
 *                   properties:
 *                     operatorId:
 *                       type: number
 *                       example: 29239246
 *                     company:
 *                       type: string
 *                       example: "SuperBus Services"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *       400:
 *         description: Bad request due to invalid vehicleId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, vehicleId should be a number"
 *       404:
 *         description: Vehicle not found.
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
  `${API_PREFIX}/vehicles/:vehicleId`,
  param("vehicleId")
    .isNumeric()
    .withMessage("bad request, vehicleId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { vehicleId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundVehicle = await getVehicleById(vehicleId);
      if (foundVehicle) return response.send(foundVehicle);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`vehicle getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.9/vehicles/{vehicleId}:
 *   put:
 *     summary: Update a vehicle by its ID
 *     tags:
 *       - Vehicle
 *     description: Update the details of a specific vehicle using its ID.
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         description: The unique ID of the vehicle to be updated.
 *         schema:
 *           type: integer
 *           example: 54395929
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "ABC12345"
 *               model:
 *                 type: string
 *                 example: "Volvo 960"
 *               capacity:
 *                 type: integer
 *                 example: 50
 *               type:
 *                 type: string
 *                 example: "Luxury"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: "ACTIVE"
 *               airCondition:
 *                 type: boolean
 *                 example: true
 *               adjustableSeats:
 *                 type: boolean
 *                 example: true
 *               chargingCapability:
 *                 type: boolean
 *                 example: false
 *               restStops:
 *                 type: boolean
 *                 example: true
 *               movie:
 *                 type: boolean
 *                 example: false
 *               music:
 *                 type: boolean
 *                 example: true
 *               cupHolder:
 *                 type: boolean
 *                 example: true
 *               emergencyExit:
 *                 type: boolean
 *                 example: true
 *               pricePerSeat:
 *                 type: number
 *                 example: 7500
 *               bookingClose:
 *                 type: integer
 *                 example: 2
 *               cancellationPolicy:
 *                 type: object
 *                 properties:
 *                   policyId:
 *                     type: integer
 *                     example: 76930122
 *                   policyName:
 *                     type: string
 *                     example: "First Payment Policy"
 *               busOperator:
 *                 type: object
 *                 properties:
 *                   operatorId:
 *                     type: integer
 *                     example: 29239246
 *                   company:
 *                     type: string
 *                     example: "SuperBus Services"
 *     responses:
 *       200:
 *         description: Vehicle details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicleId:
 *                   type: number
 *                   example: 54395929
 *                 registrationNumber:
 *                   type: string
 *                   example: "ABC12345"
 *                 model:
 *                   type: string
 *                   example: "Volvo 960"
 *                 capacity:
 *                   type: number
 *                   example: 50
 *                 type:
 *                   type: string
 *                   example: "Luxury"
 *                 status:
 *                   type: string
 *                   example: "ACTIVE"
 *                 airCondition:
 *                   type: boolean
 *                   example: true
 *                 adjustableSeats:
 *                   type: boolean
 *                   example: true
 *                 chargingCapability:
 *                   type: boolean
 *                   example: false
 *                 restStops:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   type: boolean
 *                   example: false
 *                 music:
 *                   type: boolean
 *                   example: true
 *                 cupHolder:
 *                   type: boolean
 *                   example: true
 *                 emergencyExit:
 *                   type: boolean
 *                   example: true
 *                 pricePerSeat:
 *                   type: number
 *                   example: 7500
 *                 bookingClose:
 *                   type: number
 *                   example: 2
 *                 cancellationPolicy:
 *                   type: object
 *                   properties:
 *                     policyId:
 *                       type: number
 *                       example: 76930122
 *                     policyName:
 *                       type: string
 *                       example: "First Payment Policy"
 *                 busOperator:
 *                   type: object
 *                   properties:
 *                     operatorId:
 *                       type: number
 *                       example: 29239246
 *                     company:
 *                       type: string
 *                       example: "SuperBus Services"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, vehicleId should be a number"
 *       404:
 *         description: Vehicle not found.
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
  `${API_PREFIX}/vehicles/:vehicleId`,
  param("vehicleId")
    .isNumeric()
    .withMessage("bad request, vehicleId should be a number"),
  checkSchema(vehicleSchema),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { vehicleId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const updatedVehicle = await updateVehicleById(vehicleId, data);
      if (!updatedVehicle)
        return response.status(404).send({ error: "resource not found" });
      console.log(`vehicle updated successfully`);
      return response.send(updatedVehicle);
    } catch (error) {
      console.log(`vehicle updated error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.9/vehicles/{vehicleId}:
 *   delete:
 *     summary: Delete a vehicle by its ID
 *     tags:
 *       - Vehicle
 *     description: Deletes a specific vehicle using its unique ID.
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         description: The unique ID of the vehicle to be deleted.
 *         schema:
 *           type: integer
 *           example: 54395929
 *     responses:
 *       200:
 *         description: Vehicle successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicleId:
 *                   type: number
 *                   example: 54395929
 *                 registrationNumber:
 *                   type: string
 *                   example: "ABC12345"
 *                 model:
 *                   type: string
 *                   example: "Volvo 960"
 *                 capacity:
 *                   type: number
 *                   example: 50
 *                 type:
 *                   type: string
 *                   example: "Luxury"
 *                 status:
 *                   type: string
 *                   example: "ACTIVE"
 *                 airCondition:
 *                   type: boolean
 *                   example: true
 *                 adjustableSeats:
 *                   type: boolean
 *                   example: true
 *                 chargingCapability:
 *                   type: boolean
 *                   example: false
 *                 restStops:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   type: boolean
 *                   example: false
 *                 music:
 *                   type: boolean
 *                   example: true
 *                 cupHolder:
 *                   type: boolean
 *                   example: true
 *                 emergencyExit:
 *                   type: boolean
 *                   example: true
 *                 pricePerSeat:
 *                   type: number
 *                   example: 7500
 *                 bookingClose:
 *                   type: number
 *                   example: 2
 *                 cancellationPolicy:
 *                   type: object
 *                   properties:
 *                     policyId:
 *                       type: number
 *                       example: 76930122
 *                     policyName:
 *                       type: string
 *                       example: "First Payment Policy"
 *                 busOperator:
 *                   type: object
 *                   properties:
 *                     operatorId:
 *                       type: number
 *                       example: 29239246
 *                     company:
 *                       type: string
 *                       example: "SuperBus Services"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T11:42:17.970Z"
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, vehicleId should be a number"
 *       404:
 *         description: Vehicle not found.
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
  `${API_PREFIX}/vehicles/:vehicleId`,
  param("vehicleId")
    .isNumeric()
    .withMessage("bad request, vehicleId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { vehicleId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedVehicle = await deleteVehicleById(vehicleId);
      if (!deletedVehicle)
        return response.status(404).send({ error: "resource not found" });
      console.log(`vehicle deleted successfully`);
      return response.send(deletedVehicle);
    } catch (error) {
      console.log(`vehicle deleting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/vehicles*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
