import { response, Router } from "express";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "../common/util/hash.mjs";

const router = Router();
const client = new CognitoIdentityProviderClient({
  region: process.env.FINAL_AWS_REGION,
});

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(`${API_PREFIX}/auth`, async (request, response) => {
  try {
    const { username, password } = request.body;

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
    console.log(`login success,user,${username}`);
    return response.send({
      accessToken: cognitoResponse.AuthenticationResult.AccessToken,
      refreshToken: cognitoResponse.AuthenticationResult.RefreshToken,
      idToken: cognitoResponse.AuthenticationResult.IdToken,
    });
  } catch (error) {
    console.log(`login failed,user,${username},error, ${error}`);
    return response.status(401).json({ error: "invalid credentials" });
  }
});

router.all(`${API_PREFIX}/auth*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
