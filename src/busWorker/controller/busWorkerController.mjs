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
import { log } from "../../common/util/log.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/bus-workers`,
  checkSchema(busWorkerSchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    const result = validationResult(request);
    if (!result.isEmpty()) {
      log(baseLog, "FAILED", result.errors[0]);
      return response.status(400).send({ error: result.errors[0].msg });
    }

    const data = matchedData(request);

    try {
      const foundWorker = await BusWorker.findOne({
        nic: data.nic,
      });
      if (foundWorker) {
        log(baseLog, "FAILED", "nic is already in the system");
        return response
          .status(400)
          .send({ error: "nic is already in the system" });
      }

      data.workerId = generateShortUuid();
      const createdWorker = await createNewBusWorker(data);

      log(baseLog, "SUCCESS", {});
      return response.status(201).send(createdWorker);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(`${API_PREFIX}/bus-workers`, async (request, response) => {
  const baseLog = request.baseLog;

  try {
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 10;
    const all = request.query.all === "true";
    const skip = (page - 1) * limit;

    const foundWorkers = await getAllworkers();
    if (all) {
      log(baseLog, "SUCCESS", {});
      return response.send({
        data: foundWorkers,
        total: foundWorkers.length,
      });
    } else {
      const paginatedWorkers = foundWorkers.slice(skip, skip + limit);
      const totalWorkers = foundWorkers.length;
      const totalPages = Math.ceil(totalWorkers / limit);

      log(baseLog, "SUCCESS", {});
      return response.send({
        data: paginatedWorkers,
        currentPage: page,
        totalPages,
        total: totalWorkers,
      });
    }
  } catch (error) {
    log(baseLog, "FAILED", error.message);
    return response.status(500).send({ error: "internal server error" });
  }
});

router.get(
  `${API_PREFIX}/bus-workers/:workerId`,
  param("workerId")
    .isNumeric()
    .withMessage("bad request, workerId should be a number"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { workerId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundWorker = await getWorkerById(workerId);

      if (foundWorker) {
        log(baseLog, "SUCCESS", {});
        return response.send(foundWorker);
      } else {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
    } catch (error) {
      log(baseLog, "FAILED", error.message);
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
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { nic },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundWorker = await getWorkerByNic(nic);

      if (foundWorker) {
        log(baseLog, "SUCCESS", {});
        return response.send(foundWorker);
      } else {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
    } catch (error) {
      log(baseLog, "FAILED", error.message);
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
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { workerId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const updatedWorker = await updateWorkerById(workerId, data);

      if (!updatedWorker) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(updatedWorker);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
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
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { workerId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const deletedWorker = await deleteWorkerById(workerId);

      if (!deletedWorker) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(deletedWorker);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/bus-workers*`, (request, response) => {
  const baseLog = request.baseLog;
  log(baseLog, "FAILED", "method not allowed");
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
