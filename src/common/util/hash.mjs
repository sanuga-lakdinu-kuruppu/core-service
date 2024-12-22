import crypto from "crypto";

export const generateSecretHash = (username, clientId, clientSecret) => {
  const hmac = crypto.createHmac("sha256", clientSecret);
  hmac.update(`${username}${clientId}`);
  return hmac.digest("base64");
};
