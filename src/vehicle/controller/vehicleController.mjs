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

router.get(`${API_PREFIX}/vehicles`, async (request, response) => {
  try {
    const foundVehicles = await getAllVehicles();
    return response.send(foundVehicles);
  } catch (error) {
    console.log(`vehicle getting error ${error}`);
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
