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
import { log } from "../../common/util/log.mjs";

const router = Router();

const SERVICE_NAME = process.env.SERVICE;
const VERSION = process.env.VERSION;
const API_PREFIX = `/${SERVICE_NAME}/${VERSION}`;

router.post(
  `${API_PREFIX}/schedules`,
  checkSchema(scheduleSchema),
  async (request, response) => {
    const baseLog = request.baseLog;

    const result = validationResult(request);
    if (!result.isEmpty()) {
      log(baseLog, "FAILED", result.errors[0]);
      return response.status(400).send({ error: result.errors[0].msg });
    }

    const data = matchedData(request);

    try {
      data.scheduleId = generateShortUuid();
      const createdSchedule = await createNewSchedule(data);

      log(baseLog, "SUCCESS", {});
      return response.status(201).send(createdSchedule);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.get(`${API_PREFIX}/schedules`, async (request, response) => {
  const baseLog = request.baseLog;

  try {
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 10;
    const all = request.query.all === "true";
    const skip = (page - 1) * limit;

    const foundSchedules = await getAllSchedules();
    if (all) {
      log(baseLog, "SUCCESS", {});
      return response.send({
        data: foundSchedules,
        total: foundSchedules.length,
      });
    } else {
      const paginatedSchedules = foundSchedules.slice(skip, skip + limit);
      const totalSchedules = foundSchedules.length;
      const totalPages = Math.ceil(totalSchedules / limit);

      log(baseLog, "SUCCESS", {});
      return response.send({
        data: paginatedSchedules,
        currentPage: page,
        totalPages,
        total: totalSchedules,
      });
    }
  } catch (error) {
    log(baseLog, "FAILED", error.message);
    return response.status(500).send({ error: "internal server error" });
  }
});

router.get(
  `${API_PREFIX}/schedules/:scheduleId`,
  param("scheduleId")
    .isNumeric()
    .withMessage("bad request, scheduleId should be a number"),
  async (request, response) => {
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { scheduleId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const foundSchedule = await getScheduleById(scheduleId);

      if (foundSchedule) {
        log(baseLog, "SUCCESS", {});
        return response.send(foundSchedule);
      } else {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
    } catch (error) {
      log(baseLog, "FAILED", error.message);
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
    const baseLog = request.baseLog;

    try {
      const result = validationResult(request);
      const {
        params: { scheduleId },
      } = request;
      if (!result.isEmpty()) {
        log(baseLog, "FAILED", result.errors[0]);
        return response.status(400).send({ error: result.errors[0].msg });
      }

      const deletedSchedule = await deleteScheduleById(scheduleId);

      if (!deletedSchedule) {
        log(baseLog, "FAILED", "resouce not found");
        return response.status(404).send({ error: "resource not found" });
      }
      log(baseLog, "SUCCESS", {});
      return response.send(deletedSchedule);
    } catch (error) {
      log(baseLog, "FAILED", error.message);
      return response.status(500).send({ error: "internal server error" });
    }
  }
);

router.all(`${API_PREFIX}/schedules*`, (request, response) => {
  const baseLog = request.baseLog;
  log(baseLog, "FAILED", "method not allowed");
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
