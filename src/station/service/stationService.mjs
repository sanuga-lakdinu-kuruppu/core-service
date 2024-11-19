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
