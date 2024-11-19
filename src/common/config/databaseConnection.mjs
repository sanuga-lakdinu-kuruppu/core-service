import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ENVIRONMENT = process.env.ENVIRONMENT;
const MONGO_URI =
  ENVIRONMENT === "local"
    ? process.env.MONGO_URI_LOCAL
    : process.env.MONGO_URI_PRODUCTION;
let isConnected = false;

const createConnection = async () => {
  if (isConnected) {
    console.log(`using the cached data base connection :)`);
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`database connection success :)`);
  } catch (error) {
    console.log(`database connection error ${error}`);
  }
};

export default createConnection;
