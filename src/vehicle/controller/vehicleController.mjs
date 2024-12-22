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
import { log } from "../../common/util/log.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/vehicles`,
  checkSchema(vehicleSchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    const result = validationResult(request);
    if (!result.isEmpty()) {
      log(baseLog, "FAILED", result.errors[0]);
      return response.status(400).send({ error: result.errors[0].msg });
    }

    const data = matchedData(request);

    try {
      data.vehicleId = generateShortUuid();
      const createdVehicle = await createNewVehicle(data);

      if (createdVehicle) {
        log(baseLog, "SUCCESS", {});
        return response.status(201).send(createdVehicle);
      }
      log(baseLog, "FAILED", "internal server error");
      return response.status(500).send({ error: "internal server error" });
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(`${API_PREFIX}/vehicles`, async (request, response) => {
  const baseLog = request.baseLog;

  try {
    const foundVehicles = await getAllVehicles();

    log(baseLog, "SUCCESS", {});
    return response.send(foundVehicles);
  } catch (error) {
    log(baseLog, "FAILED", error.message);
    return response.status(500).send({ error: "internal server error" });
  }
});

router.get(
  `${API_PREFIX}/vehicles/registrationNumber/:registrationNumber`,
  param("registrationNumber")
    .isString()
    .withMessage("bad request, registrationNumber should be a String")
    .isLength({ max: 50 })
    .withMessage("registrationNumber must be less than 50 characters"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { registrationNumber },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundVehicle = await getVehicleByRegistrationNumber(
        registrationNumber
      );

      if (foundVehicle) {
        log(baseLog, "SUCCESS", {});
        return response.send(foundVehicle);
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
  `${API_PREFIX}/vehicles/:vehicleId`,
  param("vehicleId")
    .isNumeric()
    .withMessage("bad request, vehicleId should be a number"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { vehicleId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundVehicle = await getVehicleById(vehicleId);

      if (foundVehicle) {
        log(baseLog, "SUCCESS", {});
        return response.send(foundVehicle);
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
  `${API_PREFIX}/vehicles/:vehicleId`,
  param("vehicleId")
    .isNumeric()
    .withMessage("bad request, vehicleId should be a number"),
  checkSchema(vehicleSchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { vehicleId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const updatedVehicle = await updateVehicleById(vehicleId, data);

      if (!updatedVehicle) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(updatedVehicle);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.delete(
  `${API_PREFIX}/vehicles/:vehicleId`,
  param("vehicleId")
    .isNumeric()
    .withMessage("bad request, vehicleId should be a number"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { vehicleId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const deletedVehicle = await deleteVehicleById(vehicleId);

      if (!deletedVehicle) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(deletedVehicle);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/vehicles*`, (request, response) => {
  const baseLog = request.baseLog;
  log(baseLog, "FAILED", "method not allowed");
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
