import { response, Router } from "express";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import {
  createNewBusWorker,
  getAllworkers,
  getWorkerById,
  getWorkerByNic,
  updateWorkerById,
  deleteWorkerById,
} from "../service/busWorkerService.mjs";
import { generateShortUuid } from "../../common/util/unique.mjs";
import { busWorkerSchema } from "../schema/busWorkerSchema.mjs";
import { BusWorker } from "../model/busWorkerModel.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

/**
 * @swagger
 * /core-service/v1.8/bus-workers:
 *   post:
 *     summary: Create a new bus worker
 *     tags:
 *       - Bus Worker
 *     description: Create a new bus worker with the provided data.
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
 *               nic:
 *                 type: string
 *                 example: "200127201635"
 *               type:
 *                 type: string
 *                 example: "DRIVER"
 *               contact:
 *                 type: object
 *                 properties:
 *                   mobile:
 *                     type: string
 *                     example: "+94778060563"
 *                   email:
 *                     type: string
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
 *       201:
 *         description: Bus worker creation success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workerId:
 *                   type: number
 *                   example: 25856546
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-29T05:30:56.563Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-29T05:30:56.563Z"
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Sanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 nic:
 *                   type: string
 *                   example: "200127201635"
 *                 type:
 *                   type: string
 *                   example: "DRIVER"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
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
 *         description: Bad request. Validation errors in input data.
 *       405:
 *         description: Method not allowed.
 *       500:
 *         description: Internal server error.
 */
router.post(
  `${API_PREFIX}/bus-workers`,
  checkSchema(busWorkerSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      const foundWorker = await BusWorker.findOne({
        nic: data.nic,
      });
      if (foundWorker) {
        return response
          .status(400)
          .send({ error: "nic is already in the system" });
      }
      data.workerId = generateShortUuid();
      const createdWorker = await createNewBusWorker(data);
      return response.status(201).send(createdWorker);
    } catch (error) {
      console.log(`worker creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.8/bus-workers:
 *   get:
 *     summary: Retrieve all bus workers
 *     tags:
 *       - Bus Worker
 *     description: Retrieve a list of all bus workers with their details.
 *     responses:
 *       200:
 *         description: A list of bus workers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   workerId:
 *                     type: number
 *                     example: 54568841
 *                   name:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                         example: "Sanuga"
 *                       lastName:
 *                         type: string
 *                         example: "Kuruppu"
 *                   contact:
 *                     type: object
 *                     properties:
 *                       mobile:
 *                         type: string
 *                         example: "+94778060563"
 *                       email:
 *                         type: string
 *                         example: "sanugakuruppu.info@gmail.com"
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
 *                   type:
 *                     type: string
 *                     example: "DRIVER"
 *                   nic:
 *                     type: string
 *                     example: "200127016535"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-28T17:34:24.743Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-28T17:34:24.743Z"
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
router.get(`${API_PREFIX}/bus-workers`, async (request, response) => {
  try {
    const foundWorkers = await getAllworkers();
    return response.send(foundWorkers);
  } catch (error) {
    console.log(`worker getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

/**
 * @swagger
 * /core-service/v1.8/bus-workers/{workerId}:
 *   get:
 *     summary: Retrieve a specific bus worker by ID
 *     tags:
 *       - Bus Worker
 *     description: Retrieve details of a bus worker using their unique worker ID.
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: number
 *         description: The unique ID of the bus worker.
 *     responses:
 *       200:
 *         description: Worker details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workerId:
 *                   type: number
 *                   example: 54568841
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Sanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
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
 *                 type:
 *                   type: string
 *                   example: "DRIVER"
 *                 nic:
 *                   type: string
 *                   example: "200127016535"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T17:34:24.743Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T17:34:24.743Z"
 *       400:
 *         description: Bad request. Invalid worker ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, workerId should be a number"
 *       404:
 *         description: Worker not found.
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
  `${API_PREFIX}/bus-workers/:workerId`,
  param("workerId")
    .isNumeric()
    .withMessage("bad request, workerId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { workerId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundWorker = await getWorkerById(workerId);
      if (foundWorker) return response.send(foundWorker);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`worker getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.8/bus-workers/nic/{nic}:
 *   get:
 *     summary: Retrieve a specific bus worker by NIC
 *     tags:
 *       - Bus Worker
 *     description: Retrieve details of a bus worker using their National Identity Card (NIC).
 *     parameters:
 *       - in: path
 *         name: nic
 *         required: true
 *         schema:
 *           type: string
 *           example: "200127016535"
 *         description: The NIC of the bus worker. Valid formats are either '123456789V' or '200012345678'.
 *     responses:
 *       200:
 *         description: Worker details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workerId:
 *                   type: number
 *                   example: 54568841
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Sanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
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
 *                 type:
 *                   type: string
 *                   example: "DRIVER"
 *                 nic:
 *                   type: string
 *                   example: "200127016535"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T17:34:24.743Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T17:34:24.743Z"
 *       400:
 *         description: Bad request. Invalid NIC format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "nic must be a valid Sri Lankan NIC in the format '123456789V' or '200012345678'"
 *       404:
 *         description: Worker not found.
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
  `${API_PREFIX}/bus-workers/nic/:nic`,
  param("nic")
    .notEmpty()
    .withMessage("nic cannot be empty")
    .isString()
    .withMessage("nic must be a string")
    .isLength({ min: 9, max: 12 })
    .withMessage("nic must be between 9 and 12 characters")
    .matches(/^(?:\d{9}[vVxX]|\d{12})$/)
    .withMessage(
      "nic must be a valid Sri Lankan NIC in the format '123456789V' or '200012345678'"
    )
    .trim(),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { nic },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundWorker = await getWorkerByNic(nic);
      if (foundWorker) return response.send(foundWorker);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`worker getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.8/bus-workers/{workerId}:
 *   put:
 *     summary: Update bus worker details
 *     tags:
 *       - Bus Worker
 *     description: Updates the details of a specific bus worker using their workerId.
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 54568841
 *         description: The unique ID of the bus worker.
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
 *                     example: "dassfaanuga"
 *                   lastName:
 *                     type: string
 *                     example: "Kuruppu"
 *               nic:
 *                 type: string
 *                 example: "200127201635"
 *                 description: Sri Lankan NIC number in valid format.
 *               type:
 *                 type: string
 *                 enum: [DRIVER, CONDUCTOR]
 *                 example: "DRIVER"
 *               contact:
 *                 type: object
 *                 properties:
 *                   mobile:
 *                     type: string
 *                     example: "+94778060563"
 *                   email:
 *                     type: string
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
 *         description: Worker updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workerId:
 *                   type: integer
 *                   example: 54568841
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T17:34:24.743Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-29T05:39:10.590Z"
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "dassfaanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 type:
 *                   type: string
 *                   example: "DRIVER"
 *                 nic:
 *                   type: string
 *                   example: "200127201635"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
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
 *         description: Bad request. Validation error in input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, workerId should be a number"
 *       404:
 *         description: Worker not found.
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
  `${API_PREFIX}/bus-workers/:workerId`,
  param("workerId")
    .isNumeric()
    .withMessage("bad request, workerId should be a number"),
  checkSchema(busWorkerSchema),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { workerId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const updatedWorker = await updateWorkerById(workerId, data);
      if (!updatedWorker)
        return response.status(404).send({ error: "resource not found" });
      console.log(`worker updated successfully`);
      return response.send(updatedWorker);
    } catch (error) {
      console.log(`worker updating error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

/**
 * @swagger
 * /core-service/v1.8/bus-workers/{workerId}:
 *   delete:
 *     summary: Delete a bus worker
 *     tags:
 *       - Bus Worker
 *     description: Deletes a specific bus worker using their workerId.
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 54568841
 *         description: The unique ID of the bus worker to delete.
 *     responses:
 *       200:
 *         description: Worker deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workerId:
 *                   type: integer
 *                   example: 54568841
 *                 name:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "dassfaanuga"
 *                     lastName:
 *                       type: string
 *                       example: "Kuruppu"
 *                 type:
 *                   type: string
 *                   example: "DRIVER"
 *                 nic:
 *                   type: string
 *                   example: "200127201635"
 *                 contact:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: string
 *                       example: "+94778060563"
 *                     email:
 *                       type: string
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
 *                   example: "2024-11-28T17:34:24.743Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-29T05:39:10.590Z"
 *       400:
 *         description: Bad request. Validation error in input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, workerId should be a number"
 *       404:
 *         description: Worker not found.
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
  `${API_PREFIX}/bus-workers/:workerId`,
  param("workerId")
    .isNumeric()
    .withMessage("bad request, workerId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { workerId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedWorker = await deleteWorkerById(workerId);
      if (!deletedWorker)
        return response.status(404).send({ error: "resource not found" });
      console.log(`worker deleted successfully`);
      return response.send(deletedWorker);
    } catch (error) {
      console.log(`worker deleting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/bus-workers*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
