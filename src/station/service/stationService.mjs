import { Station } from "../model/stationModel.mjs";

export const createNewStation = async (station) => {
  try {
    const newStation = new Station(station);
    const savedStation = await newStation.save();
    console.log(`station saved successfully :)`);
    const returnStation = filterStationFields(savedStation);
    return returnStation;
  } catch (error) {
    console.log(`station creation error ${error}`);
  }
};

export const getAllStations = async (filter = {}) => {
  try {
    const foundStations = await Station.find(filter).select(
      "stationId name createdAt updatedAt name coordinates.lat coordinates.log -_id"
    );
    console.log(`stations fetched successfully`);
    return foundStations;
  } catch (error) {
    console.log(`station getting error ${error}`);
  }
};

export const getStationById = async (id) => {
  try {
    const foundStation = await Station.findOne({ stationId: id }).select(
      "stationId name createdAt updatedAt name coordinates.lat coordinates.log -_id"
    );
    console.log(`station fetched successfully`);
    return foundStation;
  } catch (error) {
    console.log(`station getting error ${error}`);
  }
};

export const updateStationById = async (id, newData) => {
  try {
    const updatedStation = await Station.findOneAndUpdate(
      { stationId: id },
      newData,
      { new: true, runValidators: true }
    );
    if (!updatedStation) return null;
    return filterStationFields(updatedStation);
  } catch (error) {
    console.log(`station getting error ${error}`);
  }
};

export const deleteStationById = async (id) => {
  try {
    const deletedStation = await Station.findOneAndDelete({ stationId: id });
    if (!deletedStation) return null;
    return filterStationFields(deletedStation);
  } catch (error) {
    console.log(`station getting error ${error}`);
  }
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
