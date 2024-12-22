import { Station } from "../model/stationModel.mjs";

export const createNewStation = async (station) => {
  const newStation = new Station(station);
  const savedStation = await newStation.save();
  const returnStation = filterStationFields(savedStation);
  return returnStation;
};

export const getAllStations = async (filter = {}) => {
  const foundStations = await Station.find(filter).select(
    "stationId name createdAt updatedAt name coordinates.lat coordinates.log -_id"
  );
  return foundStations;
};

export const getStationById = async (id) => {
  const foundStation = await Station.findOne({ stationId: id }).select(
    "stationId name createdAt updatedAt name coordinates.lat coordinates.log -_id"
  );
  return foundStation;
};

export const updateStationById = async (id, newData) => {
  const updatedStation = await Station.findOneAndUpdate(
    { stationId: id },
    newData,
    { new: true, runValidators: true }
  );
  if (!updatedStation) return null;
  return filterStationFields(updatedStation);
};

export const deleteStationById = async (id) => {
  const deletedStation = await Station.findOneAndDelete({ stationId: id });
  if (!deletedStation) return null;
  return filterStationFields(deletedStation);
};

const filterStationFields = (station) => ({
  stationId: station.stationId,
  createdAt: station.createdAt,
  updatedAt: station.updatedAt,
  name: station.name,
  coordinates: {
    lat: station.coordinates.lat,
    log: station.coordinates.log,
  },
});
