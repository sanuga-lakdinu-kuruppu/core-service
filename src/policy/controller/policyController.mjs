import { response, Router } from "express";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
  query,
} from "express-validator";
import { createNewPolicy } from "../service/policyService.mjs";
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

router.all(`${API_PREFIX}/policies*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
