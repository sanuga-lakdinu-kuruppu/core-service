import { BusWorker } from "../model/busWorkerModel.mjs";

export const createNewBusWorker = async (worker) => {
  try {
    const newWorker = new BusWorker(worker);
    const savedWorker = await newWorker.save();
    console.log(`worker saved successfully :)`);
    const returnWorker = filterWorkerFields(savedWorker);
    return returnWorker;
  } catch (error) {
    console.log(`worker creation error ${error}`);
  }
};

export const getAllworkers = async () => {
  try {
    const foundWorkers = await BusWorker.find().select(
      "workerId createdAt updatedAt name type nic contact -_id"
    );
    console.log(`worker fetched successfully`);
    return foundWorkers;
  } catch (error) {
    console.log(`worker getting error ${error}`);
  }
};

export const getWorkerById = async (id) => {
  try {
    const foundWorker = await BusWorker.findOne({ workerId: id }).select(
      "workerId createdAt updatedAt name type nic contact -_id"
    );
    console.log(`worker fetched successfully`);
    return foundWorker;
  } catch (error) {
    console.log(`worker getting error ${error}`);
  }
};

export const getWorkerByNic = async (nic) => {
  try {
    const foundWorker = await BusWorker.findOne({ nic: nic }).select(
      "workerId createdAt updatedAt name type nic contact -_id"
    );
    console.log(`worker fetched successfully`);
    return foundWorker;
  } catch (error) {
    console.log(`worker getting error ${error}`);
  }
};

export const updateWorkerById = async (id, newData) => {
  try {
    const updatedWorker = await BusWorker.findOneAndUpdate(
      { workerId: id },
      newData,
      { new: true, runValidators: true }
    );
    if (!updatedWorker) return null;
    return filterWorkerFields(updatedWorker);
  } catch (error) {
    console.log(`worker updating error ${error}`);
  }
};

export const deleteWorkerById = async (id) => {
  try {
    const foundWorker = await BusWorker.findOne({ workerId: id }).select(
      "workerId createdAt updatedAt name type nic contact -_id"
    );
    if (!foundWorker) return null;

    await BusWorker.findOneAndDelete({ workerId: id });
    return foundWorker;
  } catch (error) {
    console.log(`worker deleting error ${error}`);
  }
};

const filterWorkerFields = (worker) => ({
  workerId: worker.workerId,
  createdAt: worker.createdAt,
  updatedAt: worker.updatedAt,
  name: worker.name,
  type: worker.type,
  nic: worker.nic,
  contact: worker.contact,
});
