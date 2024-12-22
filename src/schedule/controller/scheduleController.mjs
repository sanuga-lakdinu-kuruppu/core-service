import { Router } from "express";
import { generateShortUuid } from "../../common/util/unique.mjs";
import {
  checkSchema,
  matchedData,
  validationResult,
  param,
} from "express-validator";
import { scheduleSchema } from "../schema/scheduleSchema.mjs";
import {
  createNewSchedule,
  getAllSchedules,
  getScheduleById,
  deleteScheduleById,
} from "../service/scheduleService.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/schedules`,
  checkSchema(scheduleSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.errors[0].msg });
    const data = matchedData(request);
    try {
      data.scheduleId = generateShortUuid();
      const createdSchedule = await createNewSchedule(data);
      return response.status(201).send(createdSchedule);
    } catch (error) {
      console.log(`schedule creation error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(`${API_PREFIX}/schedules`, async (request, response) => {
  try {
    const foundSchedules = await getAllSchedules();
    return response.send(foundSchedules);
  } catch (error) {
    console.log(`schedule getting error ${error}`);
    return response.status(500).send({ error: "internal server error" });
  }
});

router.get(
  `${API_PREFIX}/schedules/:scheduleId`,
  param("scheduleId")
    .isNumeric()
    .withMessage("bad request, scheduleId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { scheduleId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const foundSchedule = await getScheduleById(scheduleId);
      if (foundSchedule) return response.send(foundSchedule);
      else return response.status(404).send({ error: "resource not found" });
    } catch (error) {
      console.log(`schedule getting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.delete(
  `${API_PREFIX}/schedules/:scheduleId`,
  param("scheduleId")
    .isNumeric()
    .withMessage("bad request, scheduleId should be a number"),
  async (request, response) => {
    try {
      const result = validationResult(request);
      const {
        params: { scheduleId },
      } = request;
      if (!result.isEmpty())
        return response.status(400).send({ error: result.errors[0].msg });
      const deletedSchedule = await deleteScheduleById(scheduleId);
      if (!deletedSchedule)
        return response.status(404).send({ error: "resource not found" });
      console.log(`schedule deleted successfully`);
      return response.send(deletedSchedule);
    } catch (error) {
      console.log(`schedule deleting error ${error}`);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/schedules*`, (request, response) => {
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
