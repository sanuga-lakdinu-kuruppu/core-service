import { Route } from "../model/routeModel.mjs";
import { Station } from "../../station/model/stationModel.mjs";

export const createNewRoute = async (route) => {
  const startStation = await Station.findOne({
    stationId: route.startStationId,
  });
  const endStation = await Station.findOne({ stationId: route.endStationId });

  route.startLocation = startStation._id;
  route.endLocation = endStation._id;

  const newRoute = new Route(route);
  const savedRoute = await newRoute.save();

  const populatedRoute = await Route.findById(savedRoute._id)
    .select(
      "routeId routeNumber createdAt updatedAt routeName travelDistance travelDuration startLocation endLocation -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    });

  return populatedRoute;
};

export const getAllRoutes = async () => {
  const foundRoutes = await Route.find()
    .select(
      "routeId routeNumber createdAt updatedAt routeName travelDistance travelDuration startLocation endLocation -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    });
  return foundRoutes;
};

export const getRouteById = async (id) => {
  const foundRoute = await Route.findOne({ routeId: id })
    .select(
      "routeId routeNumber createdAt updatedAt routeName travelDistance travelDuration startLocation endLocation -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    });
  return foundRoute;
};

export const getRouteByNumber = async (routeNumber) => {
  const foundRoute = await Route.findOne({ routeNumber: routeNumber })
    .select(
      "routeId routeNumber createdAt updatedAt routeName travelDistance travelDuration startLocation endLocation -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    });
  return foundRoute;
};

export const updateRouteById = async (id, newData) => {
  const startStation = await Station.findOne({
    stationId: newData.startStationId,
  });
  const endStation = await Station.findOne({
    stationId: newData.endStationId,
  });

  newData.startLocation = startStation._id;
  newData.endLocation = endStation._id;

  const updatedRoute = await Route.findOneAndUpdate({ routeId: id }, newData, {
    new: true,
    runValidators: true,
  });
  if (!updatedRoute) return null;

  const returnRoute = await Route.findOne({ routeId: id })
    .select(
      "routeId routeNumber createdAt updatedAt routeName travelDistance travelDuration startLocation endLocation -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    });
  return returnRoute;
};

export const deleteRouteById = async (id) => {
  const foundRoute = await Route.findOne({ routeId: id })
    .select(
      "routeId routeNumber createdAt updatedAt routeName travelDistance travelDuration startLocation endLocation -_id"
    )
    .populate({
      path: "startLocation",
      select: "stationId name coordinates -_id",
    })
    .populate({
      path: "endLocation",
      select: "stationId name coordinates -_id",
    });
  if (!foundRoute) return null;
  await Route.findOneAndDelete({ routeId: id });
  return foundRoute;
};
