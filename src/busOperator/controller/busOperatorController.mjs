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

router.get(`${API_PREFIX}/bus-operators`, async (request, response) => {
  try {
    const foundOperators = await getAllOperators();
    return response.send(foundOperators);
  } catch (error) {
    console.log(`operator getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

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
