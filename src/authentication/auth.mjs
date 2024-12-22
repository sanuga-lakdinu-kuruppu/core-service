import { response, Router } from "express";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "../common/util/hash.mjs";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import { authSchema } from "./authSchema.mjs";
import { log } from "../common/util/log.mjs";

const router = Router();
const client = new CognitoIdentityProviderClient({
  region: process.env.FINAL_AWS_REGION,
});

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/authentications`,
  checkSchema(authSchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    const result = validationResult(request);
    if (!result.isEmpty()) {
      log(baseLog, "FAILED", result.errors[0]);
      return response.status(400).send({ error: result.errors[0].msg });
    }

    const data = matchedData(request);
    const { username, password } = data;

    try {
      const secretHash = generateSecretHash(
        username,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      );

      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
      });
      const cognitoResponse = await client.send(command);

      log(baseLog, "SUCCESS", {});
      return response.send({
        accessToken: cognitoResponse.AuthenticationResult.AccessToken,
        refreshToken: cognitoResponse.AuthenticationResult.RefreshToken,
        idToken: cognitoResponse.AuthenticationResult.IdToken,
      });
    } catch (error) {
      log(baseLog, "FAILED", "invalid credentials");
      return response.status(401).json({ error: "invalid credentials" });
    }
  }
);

router.all(`${API_PREFIX}/auth*`, (request, response) => {
  const baseLog = request.baseLog;
  log(baseLog, "FAILED", "method not allowed");
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
