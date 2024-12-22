import { Route } from "../../route/model/routeModel.mjs";
import { Permit } from "../../permit/model/permitModel.mjs";
import { Station } from "../../station/model/stationModel.mjs";
import { Schedule } from "../model/scheduleModel.mjs";

export const createNewSchedule = async (schedule) => {
  const currentStartLocation = await Station.findOne({
    stationId: schedule.startLocation,
  });
  const currentEndLocation = await Station.findOne({
    stationId: schedule.endLocation,
  });
  const currentRoute = await Route.findOne({
    routeId: schedule.route,
  });
  const currentPermit = await Permit.findOne({
    permitId: schedule.permit,
  });

  schedule.startLocation = currentStartLocation._id;
  schedule.endLocation = currentEndLocation._id;
  schedule.route = currentRoute._id;
  schedule.permit = currentPermit._id;

  const newSchedule = new Schedule(schedule);
  const savedSchedule = await newSchedule.save();

  const populatedSchedule = await Schedule.findById(savedSchedule._id)
    .select(
      "scheduleId createdAt updatedAt departureTime arrivalTime startLocation endLocation route permit -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "permit",
      select: "permitId permitNumber -_id",
    });

  return populatedSchedule;
};

export const getAllSchedules = async () => {
  const foundSchedules = await Schedule.find()
    .select(
      "scheduleId createdAt updatedAt departureTime arrivalTime startLocation endLocation route permit -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "permit",
      select: "permitId permitNumber -_id",
    });
  return foundSchedules;
};

export const getScheduleById = async (id) => {
  const foundSchedule = await Schedule.findOne({ scheduleId: id })
    .select(
      "scheduleId createdAt updatedAt departureTime arrivalTime startLocation endLocation route permit -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "permit",
      select: "permitId permitNumber -_id",
    });
  return foundSchedule;
};

export const deleteScheduleById = async (id) => {
  const foundSchedule = await Schedule.findOne({ scheduleId: id })
    .select(
      "scheduleId createdAt updatedAt departureTime arrivalTime startLocation endLocation route permit -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "permit",
      select: "permitId permitNumber -_id",
    });
  if (!foundSchedule) return null;

  await Schedule.findOneAndDelete({ scheduleId: id });
  return foundSchedule;
};
