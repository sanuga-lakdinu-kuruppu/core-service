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
import { log } from "../../common/util/log.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/bus-operators`,
  checkSchema(busOperatorSchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    const result = validationResult(request);
    if (!result.isEmpty()) {
      log(baseLog, "FAILED", result.errors[0]);
      return response.status(400).send({ error: result.errors[0].msg });
    }

    const data = matchedData(request);

    try {
      const federatedUserId = data.contact.email.split("@")[0];
      const foundOperator = await BusOperator.findOne({
        federatedUserId: federatedUserId,
      });

      if (foundOperator) {
        log(baseLog, "FAILED", "email is already registered in the system.");
        return response
          .status(400)
          .send({ error: "email is already registered in the system." });
      }

      data.operatorId = generateShortUuid();
      data.federatedUserId = federatedUserId;
      const createdOperator = await createNewBusOperator(data);

      if (createdOperator) {
        log(baseLog, "SUCCESS", {});
        return response.status(201).send(createdOperator);
      }
      log(baseLog, "FAILED", "internal server error");
      return response.status(500).send({ error: "internal server error" });
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(`${API_PREFIX}/bus-operators`, async (request, response) => {
  const baseLog = request.baseLog;

  try {
    const foundOperators = await getAllOperators();

    log(baseLog, "SUCCESS", {});
    return response.send(foundOperators);
  } catch (error) {
    log(baseLog, "FAILED", error.message);
    return response.status(500).send({ error: "internal server error" });
  }
});

router.get(
  `${API_PREFIX}/bus-operators/:operatorId`,
  param("operatorId")
    .isNumeric()
    .withMessage("bad request, operatorId should be a number"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { operatorId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundOperator = await getOperatorById(operatorId);
      if (foundOperator) {
        log(baseLog, "SUCCESS", {});
        return response.send(foundOperator);
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
  `${API_PREFIX}/bus-operators/:operatorId`,
  param("operatorId")
    .isNumeric()
    .withMessage("bad request, operatorId should be a number"),
  checkSchema(busOperatorSchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { operatorId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundOperator = await BusOperator.findOne({
        operatorId: operatorId,
      });
      if (!foundOperator) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }

      const federatedUserId = data.contact.email.split("@")[0];
      const duplicatedOperator = await BusOperator.findOne({
        federatedUserId: federatedUserId,
      });

      if (
        duplicatedOperator &&
        duplicatedOperator.operatorId !== foundOperator.operatorId
      ) {
        log(baseLog, "FAILED", "email is already registered in the system.");
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
        log(baseLog, "FAILED", "internal server error");
        return response.status(500).send({ error: "internal server error" });
      }

      log(baseLog, "SUCCESS", {});
      return response.send(updatedOperator);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
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
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { operatorId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundOperator = await BusOperator.findOne({
        operatorId: operatorId,
      });
      if (!foundOperator) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }

      const deletedOperator = await deleteOperatorById(
        operatorId,
        foundOperator
      );

      if (!deletedOperator) {
        log(baseLog, "FAILED", "internal server error");
        return response.status(500).send({ error: "internal server error" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(deletedOperator);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/bus-operators*`, (request, response) => {
  const baseLog = request.baseLog;
  log(baseLog, "FAILED", "method not allowed");
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
