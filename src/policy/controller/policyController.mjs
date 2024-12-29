import { response, Router } from "express";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
  query,
} from "express-validator";
import {
  createNewPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicyById,
  deletePolicyById,
} from "../service/policyService.mjs";
import { policySchema } from "../schema/policySchema.mjs";
import { generateShortUuid } from "../../common/util/unique.mjs";
import { log } from "../../common/util/log.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/policies`,
  checkSchema(policySchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    const result = validationResult(request);
    if (!result.isEmpty()) {
      log(baseLog, "FAILED", result.errors[0]);
      return response.status(400).send({ error: result.errors[0].msg });
    }

    const data = matchedData(request);

    try {
      data.policyId = generateShortUuid();
      const createdPolicy = await createNewPolicy(data);

      log(baseLog, "SUCCESS", {});
      return response.status(201).send(createdPolicy);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(
  `${API_PREFIX}/policies`,
  query("policyName")
    .optional()
    .isString()
    .withMessage("policy name must be a string")
    .isLength({ min: 1, max: 50 })
    .withMessage("policy name must be between 1 and 50 characters"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const page = parseInt(request.query.page, 10) || 1;
      const limit = parseInt(request.query.limit, 10) || 10;
      const all = request.query.all === "true";
      const skip = (page - 1) * limit;

      const {
        query: { policyName },
      } = request;
      const filter = policyName
        ? { policyName: new RegExp(policyName, "i") }
        : {};

      const foundPolicies = await getAllPolicies(filter);
      if (all) {
        log(baseLog, "SUCCESS", {});
        return response.send({
          data: foundPolicies,
          total: foundPolicies.length,
        });
      } else {
        const paginatedPolicies = foundPolicies.slice(skip, skip + limit);
        const totalPolicies = foundPolicies.length;
        const totalPages = Math.ceil(totalPolicies / limit);

        log(baseLog, "SUCCESS", {});
        return response.send({
          data: paginatedPolicies,
          currentPage: page,
          totalPages,
          total: totalPolicies,
        });
      }
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(
  `${API_PREFIX}/policies/:policyId`,
  param("policyId")
    .isNumeric()
    .withMessage("bad request, policyId should be a number"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { policyId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundPolicy = await getPolicyById(policyId);

      if (foundPolicy) {
        log(baseLog, "SUCCESS", {});
        return response.send(foundPolicy);
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
  `${API_PREFIX}/policies/:policyId`,
  param("policyId")
    .isNumeric()
    .withMessage("bad request, policyId should be a number"),
  checkSchema(policySchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { policyId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const updatedPolicy = await updatePolicyById(policyId, data);
      if (!updatedPolicy) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(updatedPolicy);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.delete(
  `${API_PREFIX}/policies/:policyId`,
  param("policyId")
    .isNumeric()
    .withMessage("bad request, policyId should be a number"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { policyId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const deletedPolicy = await deletePolicyById(policyId);
      if (!deletedPolicy) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(deletedPolicy);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/policies*`, (request, response) => {
  const baseLog = request.baseLog;
  log(baseLog, "FAILED", "method not allowed");
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
