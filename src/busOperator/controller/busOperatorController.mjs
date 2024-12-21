import { response, Router } from "express";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import { generateShortUuid } from "../../common/util/unique.mjs";
import {
  createNewBusOperator,
  getAllOperators,
  getOperatorById,
  updateOperatorById,
  deleteOperatorById,
} from "../service/busOperatorService.mjs";
import { busOperatorSchema } from "../schema/busOperatorSchema.mjs";
import { BusOperator } from "../model/busOperatorModel.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

/**
 * @swagger
 * /core-service/v2.0/bus-operators:
 *   post:
 *     summary: Create a new bus operator
 *     tags:
 *       - Bus Operator
 *     description: This endpoint allows users to create a new bus operator with required details such as name, contact information, and company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "Sanuga"
 *                     description: First name of the bus operator.
 *                   lastName:
 *                     type: string
 *                     example: "Kuruppu"
 *                     description: Last name of the bus operator.
 *               company:
 *                 type: string
 *                 example: "SuperBus Services"
 *                 description: Company name associated with the bus operator.
 *               contact:
 *                 type: object
 *                 properties:
 *                   mobile:
 *                     type: string
 *                     example: "+94778060563"
 *                     description: Sri Lankan mobile number of the bus operator.
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "sanugakuruppu.info@gmail.com"
 *                     description: Email address of the bus operator.
 *                   address:
 *                     type: object
 *                     properties:
 *                       no:
 *                         type: string
 *                         example: "5A"
 *                         description: Address number of the bus operator.
 *                       street1:
 *                         type: string
 *                         example: "Main Street"
 *                         description: First line of the bus operator’s address.
 *                       street2:
 *                         type: string
 *                         example: "Colombo 3"
 *                         description: Second line of the bus operator’s address.
 *                       street3:
 *                         type: string
 *                         example: "Near Central Park"
 *                         description: Third line of the bus operator’s address.
 *                       city:
 *                         type: string
 *                         example: "Colombo"
 *                         description: City of the bus operator.
 *                       district:
 *                         type: string
 *                         example: "Colombo"
 *                         description: District of the bus operator.
 *                       province:
 *                         type: string
 *                         example: "Western"
 *                         description: Province of the bus operator.
 *     responses:
 *       201:
 *         description: Bus operator successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operatorId:
 *                   type: integer
 *                   example: 26126716
 *                   description: Unique identifier for the created bus operator.
 *                 federatedUserId:
 *                   type: string
 *                   example: "sanugakuruppu.info@gmail.com"
 *                   description: Federated user ID associated with the bus operator.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T08:54:54.114Z"
 *                   description: Timestamp when the bus operator was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T08:54:54.114Z"
 *                   description: Timestamp when the bus operator details were last updated.
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Sanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 company:
 *                   type: string
 *                   example: "SuperBus Services"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "sanugakuruppu.info@gmail.com"
 *                     address:
 *                       type: object
 *                       properties:
 *                         no:
 *                           type: string
 *                           example: "5A"
 *                         street1:
 *                           type: string
 *                           example: "Main Street"
 *                         street2:
 *                           type: string
 *                           example: "Colombo 3"
 *                         street3:
 *                           type: string
 *                           example: "Near Central Park"
 *                         city:
 *                           type: string
 *                           example: "Colombo"
 *                         district:
 *                           type: string
 *                           example: "Colombo"
 *                         province:
 *                           type: string
 *                           example: "Western"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already registered in the system."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post(
  `${API_PREFIX}/bus-operators`,
  checkSchema(busOperatorSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      const federatedUserId = data.contact.email.split("@")[0];
      const foundOperator = await BusOperator.findOne({
        federatedUserId: federatedUserId,
      });
      if (foundOperator) {
        return response
          .status(400)
          .send({ error: "email is already registered in the system." });
      }
      data.operatorId = generateShortUuid();
      data.federatedUserId = federatedUserId;
      const createdOperator = await createNewBusOperator(data);
      return createdOperator
        ? response.status(201).send(createdOperator)
        : response.status(500).send({ error: "internal server error" });
    } catch (error) {
      console.log(`operator creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/bus-operators:
 *   get:
 *     summary: Get all bus operators
 *     tags:
 *       - Bus Operator
 *     description: This endpoint retrieves a list of all bus operators.
 *     responses:
 *       200:
 *         description: A list of bus operators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   operatorId:
 *                     type: integer
 *                     example: 80398012
 *                     description: Unique identifier for the bus operator.
 *                   federatedUserId:
 *                     type: string
 *                     example: "sanugakuruppu.info@gmail.com"
 *                     description: Federated user ID associated with the bus operator.
 *                   name:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                         example: "Sanuga"
 *                       lastName:
 *                         type: string
 *                         example: "Kuruppu"
 *                   company:
 *                     type: string
 *                     example: "SuperBus Services"
 *                     description: Company name associated with the bus operator.
 *                   contact:
 *                     type: object
 *                     properties:
 *                       mobile:
 *                         type: string
 *                         example: "+94778060563"
 *                         description: Sri Lankan mobile number of the bus operator.
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "sanugakuruppu.info@gmail.com"
 *                         description: Email address of the bus operator.
 *                       address:
 *                         type: object
 *                         properties:
 *                           no:
 *                             type: string
 *                             example: "5A"
 *                           street1:
 *                             type: string
 *                             example: "Main Street"
 *                           street2:
 *                             type: string
 *                             example: "Colombo 3"
 *                           street3:
 *                             type: string
 *                             example: "Near Central Park"
 *                           city:
 *                             type: string
 *                             example: "Colombo"
 *                           district:
 *                             type: string
 *                             example: "Colombo"
 *                           province:
 *                             type: string
 *                             example: "Western"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-24T09:09:23.983Z"
 *                     description: Timestamp when the bus operator was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-24T09:09:23.983Z"
 *                     description: Timestamp when the bus operator details were last updated.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
router.get(`${API_PREFIX}/bus-operators`, async (request, response) => {
  try {
    const foundOperators = await getAllOperators();
    return response.send(foundOperators);
  } catch (error) {
    console.log(`operator getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

/**
 * @swagger
 * /core-service/v2.0/bus-operators/{operatorId}:
 *   get:
 *     summary: Get a specific bus operator by ID
 *     tags:
 *       - Bus Operator
 *     description: This endpoint retrieves the details of a specific bus operator based on the operator ID.
 *     parameters:
 *       - name: operatorId
 *         in: path
 *         description: The unique identifier for the bus operator
 *         required: true
 *         schema:
 *           type: integer
 *           example: 80398012
 *     responses:
 *       200:
 *         description: A single bus operator's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operatorId:
 *                   type: integer
 *                   example: 80398012
 *                   description: Unique identifier for the bus operator.
 *                 federatedUserId:
 *                   type: string
 *                   example: "sanugakuruppu.info@gmail.com"
 *                   description: Federated user ID associated with the bus operator.
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Sanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 company:
 *                   type: string
 *                   example: "SuperBus Services"
 *                   description: Company name associated with the bus operator.
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                       description: Sri Lankan mobile number of the bus operator.
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "sanugakuruppu.info@gmail.com"
 *                       description: Email address of the bus operator.
 *                     address:
 *                       type: object
 *                       properties:
 *                         no:
 *                           type: string
 *                           example: "5A"
 *                         street1:
 *                           type: string
 *                           example: "Main Street"
 *                         street2:
 *                           type: string
 *                           example: "Colombo 3"
 *                         street3:
 *                           type: string
 *                           example: "Near Central Park"
 *                         city:
 *                           type: string
 *                           example: "Colombo"
 *                         district:
 *                           type: string
 *                           example: "Colombo"
 *                         province:
 *                           type: string
 *                           example: "Western"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T09:09:23.983Z"
 *                   description: Timestamp when the bus operator was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T09:09:23.983Z"
 *                   description: Timestamp when the bus operator details were last updated.
 *       400:
 *         description: Bad request, operatorId should be a number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, operatorId should be a number"
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error
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
  `${API_PREFIX}/bus-operators/:operatorId`,
  param("operatorId")
    .isNumeric()
    .withMessage("bad request, operatorId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { operatorId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundOperator = await getOperatorById(operatorId);
      if (foundOperator) return response.send(foundOperator);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`operator getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/bus-operators/{operatorId}:
 *   put:
 *     summary: Update a specific bus operator by ID
 *     tags:
 *       - Bus Operator
 *     description: This endpoint updates the details of a specific bus operator based on the operator ID.
 *     parameters:
 *       - name: operatorId
 *         in: path
 *         description: The unique identifier for the bus operator
 *         required: true
 *         schema:
 *           type: integer
 *           example: 80398012
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "Sanuga"
 *                   lastName:
 *                     type: string
 *                     example: "Kuruppu"
 *               company:
 *                 type: string
 *                 example: "SuperBus Services"
 *               contact:
 *                 type: object
 *                 properties:
 *                   mobile:
 *                     type: string
 *                     example: "+94778060563"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "sanugakuruppu.info@gmail.com"
 *                   address:
 *                     type: object
 *                     properties:
 *                       no:
 *                         type: string
 *                         example: "5A"
 *                       street1:
 *                         type: string
 *                         example: "Main Street"
 *                       street2:
 *                         type: string
 *                         example: "Colombo 3"
 *                       street3:
 *                         type: string
 *                         example: "Near Central Park"
 *                       city:
 *                         type: string
 *                         example: "Colombo"
 *                       district:
 *                         type: string
 *                         example: "Colombo"
 *                       province:
 *                         type: string
 *                         example: "Western"
 *     responses:
 *       200:
 *         description: Successfully updated bus operator details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operatorId:
 *                   type: integer
 *                   example: 80398012
 *                 federatedUserId:
 *                   type: string
 *                   example: "sanugakuruppu.info@gmail.com"
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Sanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 company:
 *                   type: string
 *                   example: "SuperBus Services"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "sanugakuruppu.info@gmail.com"
 *                     address:
 *                       type: object
 *                       properties:
 *                         no:
 *                           type: string
 *                           example: "5A"
 *                         street1:
 *                           type: string
 *                           example: "Main Street"
 *                         street2:
 *                           type: string
 *                           example: "Colombo 3"
 *                         street3:
 *                           type: string
 *                           example: "Near Central Park"
 *                         city:
 *                           type: string
 *                           example: "Colombo"
 *                         district:
 *                           type: string
 *                           example: "Colombo"
 *                         province:
 *                           type: string
 *                           example: "Western"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T09:09:23.983Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T09:12:06.105Z"
 *       400:
 *         description: Bad request, operatorId should be a number or email is already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, operatorId should be a number"
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error
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
  `${API_PREFIX}/bus-operators/:operatorId`,
  param("operatorId")
    .isNumeric()
    .withMessage("bad request, operatorId should be a number"),
  checkSchema(busOperatorSchema),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { operatorId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });

      const foundOperator = await BusOperator.findOne({
        operatorId: operatorId,
      });
      if (!foundOperator)
        return response.status(404).send({ error: "resource not found" });

      const federatedUserId = data.contact.email.split("@")[0];
      const duplicatedOperator = await BusOperator.findOne({
        federatedUserId: federatedUserId,
      });

      if (
        duplicatedOperator &&
        duplicatedOperator.operatorId !== foundOperator.operatorId
      ) {
        return response
          .status(400)
          .send({ error: "email is already registered in the system." });
      }
      const updatedOperator = await updateOperatorById(
        operatorId,
        data,
        foundOperator
      );
      if (!updatedOperator) {
        return response.status(500).send({ error: "internal server error" });
      }

      console.log("operator updated successfully");
      return response.send(updatedOperator);
    } catch (error) {
      console.log(`operator updated error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v2.0/bus-operators/{operatorId}:
 *   delete:
 *     summary: Delete a specific bus operator by ID
 *     tags:
 *       - Bus Operator
 *     description: This endpoint deletes a specific bus operator based on the operator ID.
 *     parameters:
 *       - name: operatorId
 *         in: path
 *         description: The unique identifier for the bus operator to be deleted
 *         required: true
 *         schema:
 *           type: integer
 *           example: 80398012
 *     responses:
 *       200:
 *         description: Successfully deleted the bus operator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operatorId:
 *                   type: integer
 *                   example: 80398012
 *                 federatedUserId:
 *                   type: string
 *                   example: "sanugakuruppu.info@gmail.com"
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Sanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 company:
 *                   type: string
 *                   example: "SuperBus Services"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "sanugakuruppu.info@gmail.com"
 *                     address:
 *                       type: object
 *                       properties:
 *                         no:
 *                           type: string
 *                           example: "5A"
 *                         street1:
 *                           type: string
 *                           example: "Main Street"
 *                         street2:
 *                           type: string
 *                           example: "Colombo 3"
 *                         street3:
 *                           type: string
 *                           example: "Near Central Park"
 *                         city:
 *                           type: string
 *                           example: "Colombo"
 *                         district:
 *                           type: string
 *                           example: "Colombo"
 *                         province:
 *                           type: string
 *                           example: "Western"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T09:09:23.983Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T09:12:06.105Z"
 *       400:
 *         description: Bad request, operatorId should be a number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, operatorId should be a number"
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error
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
  `${API_PREFIX}/bus-operators/:operatorId`,
  param("operatorId")
    .isNumeric()
    .withMessage("bad request, operatorId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { operatorId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });

      const foundOperator = await BusOperator.findOne({
        operatorId: operatorId,
      });
      if (!foundOperator)
        return response.status(404).send({ error: "resource not found" });

      const deletedOperator = await deleteOperatorById(
        operatorId,
        foundOperator
      );
      if (!deletedOperator)
        return response.status(500).send({ error: "internal server error" });
      console.log(`operator deleted successfully`);
      return response.send(deletedOperator);
    } catch (error) {
      console.log(`operator deleting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/bus-operators*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
