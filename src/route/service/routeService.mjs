import { Route } from "../model/routeModel.mjs";
import { Station } from "../../station/model/stationModel.mjs";

export const createNewRoute = async (route) => {
  try {
    const startStation = await Station.findOne({
      stationId: route.startStationId,
    });
    const endStation = await Station.findOne({ stationId: route.endStationId });

    route.startLocation = startStation._id;
    route.endLocation = endStation._id;

    const newRoute = new Route(route);
    const savedRoute = await newRoute.save();
    console.log(`route saved successfully :)`);

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
  } catch (error) {
    console.log(`route creation error ${error}`);
  }
};

export const getAllRoutes = async () => {
  try {
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
    console.log(`routes fetched successfully`);
    return foundRoutes;
  } catch (error) {
    console.log(`routes getting error ${error}`);
  }
};

export const getRouteById = async (id) => {
  try {
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
    console.log(`route fetched successfully`);
    return foundRoute;
  } catch (error) {
    console.log(`route getting error ${error}`);
  }
};

export const getRouteByNumber = async (routeNumber) => {
  try {
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
    console.log(`route fetched successfully`);
    return foundRoute;
  } catch (error) {
    console.log(`route getting error ${error}`);
  }
};

export const updateRouteById = async (id, newData) => {
  try {
    const startStation = await Station.findOne({
      stationId: newData.startStationId,
    });
    const endStation = await Station.findOne({
      stationId: newData.endStationId,
    });

    newData.startLocation = startStation._id;
    newData.endLocation = endStation._id;

    const updatedRoute = await Route.findOneAndUpdate(
      { routeId: id },
      newData,
      { new: true, runValidators: true }
    );
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
  } catch (error) {
    console.log(`station getting error ${error}`);
  }
};

export const deleteRouteById = async (id) => {
  try {
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
  } catch (error) {
    console.log(`route deleting error ${error}`);
  }
};
