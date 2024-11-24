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

/**
 * @swagger
 * /core-service/v1.7/policies:
 *   post:
 *     summary: Create a new policy
 *     tags:
 *       - Policy
 *     description: Create a new policy with the provided data. The description field is optional.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyName:
 *                 type: string
 *                 example: "Health Insurance"
 *                 description: "The name of the policy."
 *               type:
 *                 type: string
 *                 example: "General"
 *                 description: "The type of the policy."
 *               description:
 *                 type: string
 *                 example: "Comprehensive health coverage for all employees."
 *                 description: "The description of the policy (optional)."
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Policy creation success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 policyId:
 *                   type: string
 *                   example: "a1b2c3d4e5"
 *                 policyName:
 *                   type: string
 *                   example: "Health Insurance"
 *                 type:
 *                   type: string
 *                   example: "General"
 *                 description:
 *                   type: string
 *                   example: "Comprehensive health coverage for all employees."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-23T10:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "name must be a string"
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "method not allowed"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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

/**
 * @swagger
 * /core-service/v1.7/policies:
 *   get:
 *     summary: Retrieve a list of policies
 *     tags:
 *       - Policy
 *     description: Retrieve a list of policies, optionally filtered by `policyName`.
 *     parameters:
 *       - name: policyName
 *         in: query
 *         description: The name of the policy to filter by.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Health Insurance"
 *           maxLength: 50
 *     responses:
 *       200:
 *         description: A list of policies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   policyId:
 *                     type: string
 *                     example: "a1b2c3d4e5"
 *                   policyName:
 *                     type: string
 *                     example: "Health Insurance"
 *                   type:
 *                     type: string
 *                     example: "General"
 *                   description:
 *                     type: string
 *                     example: "Comprehensive health coverage for all employees."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-23T10:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-23T10:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "policy name must be a string"
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "method not allowed"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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

/**
 * @swagger
 * /core-service/v1.7/policies/{policyId}:
 *   get:
 *     summary: Retrieve a policy by its ID
 *     tags:
 *       - Policy
 *     description: Retrieve a single policy using its unique identifier (`policyId`).
 *     parameters:
 *       - name: policyId
 *         in: path
 *         description: The unique ID of the policy.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved the policy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 policyId:
 *                   type: integer
 *                   example: 123
 *                 policyName:
 *                   type: string
 *                   example: "Health Insurance"
 *                 type:
 *                   type: string
 *                   example: "General"
 *                 description:
 *                   type: string
 *                   example: "Comprehensive health coverage for all employees."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in the input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, policyId should be a number"
 *       404:
 *         description: Resource not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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

/**
 * @swagger
 * /core-service/v1.7/policies/{policyId}:
 *   put:
 *     summary: Update an existing policy
 *     tags:
 *       - Policy
 *     description: Update the details of a policy using its unique identifier (`policyId`).
 *     parameters:
 *       - name: policyId
 *         in: path
 *         description: The unique ID of the policy to be updated.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyName:
 *                 type: string
 *                 example: "Updated Health Insurance"
 *                 description: "The updated name of the policy."
 *               type:
 *                 type: string
 *                 example: "General"
 *                 description: "The updated type of the policy."
 *               description:
 *                 type: string
 *                 example: "Updated description for comprehensive health coverage."
 *                 description: "The updated description of the policy (optional)."
 *                 nullable: true
 *             required:
 *               - policyName
 *               - type
 *     responses:
 *       200:
 *         description: Successfully updated the policy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 policyId:
 *                   type: integer
 *                   example: 123
 *                 policyName:
 *                   type: string
 *                   example: "Updated Health Insurance"
 *                 type:
 *                   type: string
 *                   example: "General"
 *                 description:
 *                   type: string
 *                   example: "Updated description for comprehensive health coverage."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-24T12:00:00Z"
 *       400:
 *         description: Bad request. Validation errors in input data or query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "policyId should be a number"
 *       404:
 *         description: Resource not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */
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

/**
 * @swagger
 * /core-service/v1.7/policies/{policyId}:
 *   delete:
 *     summary: Delete a policy
 *     tags:
 *       - Policy
 *     description: Deletes a policy identified by its unique `policyId`.
 *     parameters:
 *       - name: policyId
 *         in: path
 *         description: The unique ID of the policy to be deleted.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 47970318
 *     responses:
 *       200:
 *         description: Successfully deleted the policy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 policyId:
 *                   type: integer
 *                   example: 47970318
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T07:59:41.258Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-23T07:59:41.258Z"
 *                 policyName:
 *                   type: string
 *                   example: "Frist Payment Policy"
 *                 type:
 *                   type: string
 *                   example: "FULL_REFUND"
 *                 description:
 *                   type: string
 *                   example: "Sample description"
 *       400:
 *         description: Bad request. Validation errors in query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "bad request, policyId should be a number"
 *       404:
 *         description: Resource not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "resource not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "internal server error"
 */

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
