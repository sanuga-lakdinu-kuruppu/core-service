import express from "express";
import serverless from "serverless-http";
import createConnection from "./src/common/config/databaseConnection.mjs";
import routes from "./src/common/route/router.mjs";
import { swaggerUI, swaggerDocs } from "./swagger/swaggerConfig.mjs";

const app = express();
createConnection();

const SERVICE_NAME = process.env.SERVICE;

app.use(
  `/${SERVICE_NAME}/api-docs`,
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);

app.use(express.json());

app.use(routes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`core-service is up and running on port ${PORT}`);
// });

export const handler = serverless(app);
