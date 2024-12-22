import { BusWorker } from "../model/busWorkerModel.mjs";

export const createNewBusWorker = async (worker) => {
  const newWorker = new BusWorker(worker);
  const savedWorker = await newWorker.save();
  return filterWorkerFields(savedWorker);
};

export const getAllworkers = async () => {
  const foundWorkers = await BusWorker.find().select(
    "workerId createdAt updatedAt name type nic contact -_id"
  );
  return foundWorkers;
};

export const getWorkerById = async (id) => {
  const foundWorker = await BusWorker.findOne({ workerId: id }).select(
    "workerId createdAt updatedAt name type nic contact -_id"
  );
  return foundWorker;
};

export const getWorkerByNic = async (nic) => {
  const foundWorker = await BusWorker.findOne({ nic: nic }).select(
    "workerId createdAt updatedAt name type nic contact -_id"
  );
  return foundWorker;
};

export const updateWorkerById = async (id, newData) => {
  const updatedWorker = await BusWorker.findOneAndUpdate(
    { workerId: id },
    newData,
    { new: true, runValidators: true }
  );
  if (!updatedWorker) return null;
  return filterWorkerFields(updatedWorker);
};

export const deleteWorkerById = async (id) => {
  const foundWorker = await BusWorker.findOne({ workerId: id }).select(
    "workerId createdAt updatedAt name type nic contact -_id"
  );
  if (!foundWorker) return null;

  await BusWorker.findOneAndDelete({ workerId: id });
  return foundWorker;
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
