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

router.get(`${API_PREFIX}/bus-workers`, async (request, response) => {
  try {
    const foundWorkers = await getAllworkers();
    return response.send(foundWorkers);
  } catch (error) {
    console.log(`worker getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

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
