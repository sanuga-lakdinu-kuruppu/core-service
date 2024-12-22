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

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/policies`,
  checkSchema(policySchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      data.policyId = generateShortUuid();
      const createdPolicy = await createNewPolicy(data);
      return response.status(201).send(createdPolicy);
    } catch (error) {
      console.log(`policy creation error ${error}`);
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
    try {
      const result = validationResult(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const {
        query: { policyName },
      } = request;
      const filter = policyName
        ? { policyName: new RegExp(policyName, "i") }
        : {};
      const foundPolicies = await getAllPolicies(filter);
      return response.send(foundPolicies);
    } catch (error) {
      console.log(`policy getting error ${error}`);
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
    try {
      const result = validationResult(request);
      const {
        params: { policyId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundPolicy = await getPolicyById(policyId);
      if (foundPolicy) return response.send(foundPolicy);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`policy getting error ${error}`);
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
    try {
      const result = validationResult(request);
      const {
        params: { policyId },
      } = request;
      const data = matchedData(request);
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const updatedPolicy = await updatePolicyById(policyId, data);
      if (!updatedPolicy)
        return response.status(404).send({ error: "resource not found" });
      console.log(`policy updated successfully`);
      return response.send(updatedPolicy);
    } catch (error) {
      console.log(`policy updating error ${error}`);
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
    try {
      const result = validationResult(request);
      const {
        params: { policyId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedPolicy = await deletePolicyById(policyId);
      if (!deletedPolicy)
        return response.status(404).send({ error: "resource not found" });
      console.log(`policy deleted successfully`);
      return response.send(deletedPolicy);
    } catch (error) {
      console.log(`policy deleted error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/policies*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
