import express from "express";

const app = express();

app.listen(3000, () => {
  console.log(`core-service is up and running on port ${3000}`);
});
