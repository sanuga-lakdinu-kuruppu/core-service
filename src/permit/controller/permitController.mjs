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

router.get(`${API_PREFIX}/permits`, async (request, response) => {
  try {
    const foundPermits = await getAllPermits();
    return response.send(foundPermits);
  } catch (error) {
    console.log(`permit getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

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
