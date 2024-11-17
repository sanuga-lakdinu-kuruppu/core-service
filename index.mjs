import express from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";

const app = express();

dotenv.config();

app.get("/tests", (request, response) => {
  return response.send({ msg: "This is the api testing" });
});

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`core-service is up and running on port ${PORT}`);
// });

export const handler = serverless(app);
