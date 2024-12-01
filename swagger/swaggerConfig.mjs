import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const SWAGGER_URL_PRODUCTION = process.env.SWAGGER_URL_PRODUCTION;
const SWAGGER_URL_LOCAL = process.env.SWAGGER_URL_LOCAL;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "CORE-SERVICE [BUSRIYA.COM]",
      version: "1.9.0",
      description: "Apis for core services in the busriya system",
      contact: {
        name: "Sanuga Kuruppu [YR3COBSCCOMP232P002]",
        email: "sanugakuruppu.info@gmail.com",
      },
    },
    servers: [
      {
        url: `${SWAGGER_URL_PRODUCTION}`,
        description: "Production Stage",
      },
      {
        url: `${SWAGGER_URL_LOCAL}`,
        description: "LOCAL Stage",
      },
    ],
    tags: [
      {
        name: "Station",
        description: "Operations related to stations.",
      },
      {
        name: "Policy",
        description: "Operations related to policies.",
      },
      {
        name: "Route",
        description: "Operations related to Routes.",
      },
      {
        name: "Bus Operator",
        description: "Operations related to Bus Operators.",
      },
      {
        name: "Vehicle",
        description: "Operations related to Vehicles.",
      },
      {
        name: "Bus Worker",
        description: "Operations related to Bus Workers.",
      },
      {
        name: "Permit",
        description: "Operations related to Permits.",
      },
    ],
  },
  apis: [
    "./src/station/controller/stationController.mjs",
    "./src/policy/controller/policyController.mjs",
    "./src/route/controller/routeController.mjs",
    "./src/busOperator/controller/busOperatorController.mjs",
    "./src/vehicle/controller/vehicleController.mjs",
    "./src/busWorker/controller/busWorkerController.mjs",
    "./src/permit/controller/permitController.mjs",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUI };
