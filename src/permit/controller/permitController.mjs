import { Router } from "express";
import { generateShortUuid } from "../../common/util/unique.mjs";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import {
  createNewPermit,
  getAllPermits,
  getPermitById,
  getPermitByNumber,
  deletePermitById,
} from "../service/permitService.mjs";
import { permitSchema } from "../schema/permitSchema.mjs";
import { Permit } from "../model/permitModel.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

/**
 * @swagger
 * /core-service/v2.0/permits:
 *   post:
 *     summary: Create a new permit
 *     tags:
 *       - Permit
 *     description: Creates a new permit in the system using the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permitNumber:
 *                 type: string
 *                 example: "PERMIT-2024-0003"
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-28"
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-28"
 *               route:
 *                 type: number
 *                 example: 22706966
 *               vehicle:
 *                 type: number
 *                 example: 20169714
 *               busOperator:
 *                 type: number
 *                 example: 29239246
 *     responses:
 *       201:
 *         description: Permit successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permitId:
 *                   type: number
 *                   example: 47531824
 *                 permitNumber:
 *                   type: string
 *                   example: "PERMIT-2024-0003"
 *                 issueDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:45:03.751Z"
 *                 expiryDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-28T00:00:00.000Z"
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeId:
 *                       type: number
 *                       example: 22706966
 *                     routeNumber:
 *                       type: string
 *                       example: "ACB-43290"
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: number
 *                       example: 20169714
 *                     registrationNumber:
 *                       type: string
 *                       example: "ABC12345"
 *                     model:
 *                       type: string
 *                       example: "Volvo 960"
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
 *                   example: "2024-12-01T04:45:03.751Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:45:03.751Z"
 *       400:
 *         description: Bad request. Validation errors or duplicate permit number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "permitNumber already registered in the system"
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
  `${API_PREFIX}/permits`,
  checkSchema(permitSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      const foundPermit = await Permit.findOne({
        permitNumber: data.permitNumber,
      });
      if (foundPermit)
        return response
          .status(400)
          .send({ error: "permitNumber already registered in the system" });
      data.permitId = generateShortUuid();
      const createdPermit = await createNewPermit(data);
      return response.status(201).send(createdPermit);
    } catch (error) {
      console.log(`permit creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/permits:
 *   get:
 *     summary: Retrieve all permits
 *     tags:
 *       - Permit
 *     description: Fetches all permits stored in the system along with their associated details.
 *     responses:
 *       200:
 *         description: List of all permits.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   permitId:
 *                     type: number
 *                     example: 86818915
 *                   permitNumber:
 *                     type: string
 *                     example: "PERMIT-2024-0002"
 *                   issueDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-01T04:37:12.241Z"
 *                   expiryDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-28T00:00:00.000Z"
 *                   route:
 *                     type: object
 *                     properties:
 *                       routeId:
 *                         type: number
 *                         example: 22706966
 *                       routeNumber:
 *                         type: string
 *                         example: "ACB-43290"
 *                   vehicle:
 *                     type: object
 *                     properties:
 *                       vehicleId:
 *                         type: number
 *                         example: 20169714
 *                       registrationNumber:
 *                         type: string
 *                         example: "ABC12345"
 *                       model:
 *                         type: string
 *                         example: "Volvo 960"
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
 *                     example: "2024-12-01T04:37:12.241Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-01T04:37:12.241Z"
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
router.get(`${API_PREFIX}/permits`, async (request, response) => {
  try {
    const foundPermits = await getAllPermits();
    return response.send(foundPermits);
  } catch (error) {
    console.log(`permit getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

/**
 * @swagger
 * /core-service/v2.0/permits/{permitId}:
 *   get:
 *     summary: Retrieve a permit by its ID
 *     tags:
 *       - Permit
 *     description: Fetch a specific permit's details using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: permitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the permit
 *     responses:
 *       200:
 *         description: Details of the permit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permitId:
 *                   type: number
 *                   example: 86818915
 *                 permitNumber:
 *                   type: string
 *                   example: "PERMIT-2024-0002"
 *                 issueDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:37:12.241Z"
 *                 expiryDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-28T00:00:00.000Z"
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeId:
 *                       type: number
 *                       example: 22706966
 *                     routeNumber:
 *                       type: string
 *                       example: "ACB-43290"
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: number
 *                       example: 20169714
 *                     registrationNumber:
 *                       type: string
 *                       example: "ABC12345"
 *                     model:
 *                       type: string
 *                       example: "Volvo 960"
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
 *                   example: "2024-12-01T04:37:12.241Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:37:12.241Z"
 *       400:
 *         description: Invalid input or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, permitId should be a number"
 *       404:
 *         description: Permit not found.
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
  `${API_PREFIX}/permits/:permitId`,
  param("permitId")
    .isNumeric()
    .withMessage("bad request, permitId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { permitId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundPermit = await getPermitById(permitId);
      if (foundPermit) return response.send(foundPermit);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`permit getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/permits/permitNumber/{permitNumber}:
 *   get:
 *     summary: Retrieve a permit by its permit number
 *     tags:
 *       - Permit
 *     description: Fetch details of a specific permit using its unique permit number.
 *     parameters:
 *       - in: path
 *         name: permitNumber
 *         required: true
 *         schema:
 *           type: string
 *           maxLength: 20
 *         description: Unique permit number of the permit
 *     responses:
 *       200:
 *         description: Details of the permit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permitId:
 *                   type: number
 *                   example: 86818915
 *                 permitNumber:
 *                   type: string
 *                   example: "PERMIT-2024-0002"
 *                 issueDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:37:12.241Z"
 *                 expiryDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-28T00:00:00.000Z"
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeId:
 *                       type: number
 *                       example: 22706966
 *                     routeNumber:
 *                       type: string
 *                       example: "ACB-43290"
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: number
 *                       example: 20169714
 *                     registrationNumber:
 *                       type: string
 *                       example: "ABC12345"
 *                     model:
 *                       type: string
 *                       example: "Volvo 960"
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
 *                   example: "2024-12-01T04:37:12.241Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:37:12.241Z"
 *       400:
 *         description: Invalid input or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, permitNumber should be a String"
 *       404:
 *         description: Permit not found.
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
  `${API_PREFIX}/permits/permitNumber/:permitNumber`,
  param("permitNumber")
    .isString()
    .withMessage("bad request, permitNumber should be a String")
    .isLength({ max: 20 })
    .withMessage("permitNumber must be less than 20 characters"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { permitNumber },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundPermit = await getPermitByNumber(permitNumber);
      if (foundPermit) return response.send(foundPermit);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`permit getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/permits/{permitId}:
 *   delete:
 *     summary: Delete a permit by its ID
 *     tags:
 *       - Permit
 *     description: Deletes a specific permit identified by its unique ID.
 *     parameters:
 *       - in: path
 *         name: permitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the permit to be deleted
 *     responses:
 *       200:
 *         description: Successfully deleted the permit. Returns the deleted permit details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permitId:
 *                   type: number
 *                   example: 86818915
 *                 permitNumber:
 *                   type: string
 *                   example: "PERMIT-2024-0002"
 *                 issueDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:37:12.241Z"
 *                 expiryDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-28T00:00:00.000Z"
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeId:
 *                       type: number
 *                       example: 22706966
 *                     routeNumber:
 *                       type: string
 *                       example: "ACB-43290"
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: number
 *                       example: 20169714
 *                     registrationNumber:
 *                       type: string
 *                       example: "ABC12345"
 *                     model:
 *                       type: string
 *                       example: "Volvo 960"
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
 *                   example: "2024-12-01T04:37:12.241Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T04:37:12.241Z"
 *       400:
 *         description: Invalid input or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, permitId should be a number"
 *       404:
 *         description: Permit not found.
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
  `${API_PREFIX}/permits/:permitId`,
  param("permitId")
    .isNumeric()
    .withMessage("bad request, permitId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { permitId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedPermit = await deletePermitById(permitId);
      if (!deletedPermit)
        return response.status(404).send({ error: "resource not found" });
      console.log(`permit deleted successfully`);
      return response.send(deletedPermit);
    } catch (error) {
      console.log(`permit deleting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/permits*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
