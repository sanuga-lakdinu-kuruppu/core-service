import express from "express";
import serverless from "serverless-http";
import createConnection from "./src/common/config/databaseConnection.mjs";
import routes from "./src/common/route/router.mjs";

const app = express();
createConnection();

app.use(express.json());

app.use(routes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`core-service is up and running on port ${PORT}`);
// });

export const handler = serverless(app);
