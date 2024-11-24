import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const SWAGGER_URL = process.env.SWAGGER_URL;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "CORE-SERVICE [BUSRIYA.COM]",
      version: "1.7.0",
      description: "Apis for core services in the busriya system",
      contact: {
        name: "Sanuga Kuruppu [YR3COBSCCOMP232P002]",
        email: "sanugakuruppu.info@gmail.com",
      },
    },
    servers: [
      {
        url: `${SWAGGER_URL}`,
        description: "Production Stage",
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
    ],
  },
  apis: [
    "./src/station/controller/stationController.mjs",
    "./src/policy/controller/policyController.mjs",
    "./src/route/controller/routeController.mjs",
    "./src/busOperator/controller/busOperatorController.mjs",
    "./src/vehicle/controller/vehicleController.mjs",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUI };
