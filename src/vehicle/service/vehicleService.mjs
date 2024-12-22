import { Policy } from "../../policy/model/policyModel.mjs";
import { BusOperator } from "../../busOperator/model/busOperatorModel.mjs";
import { Vehicle } from "../model/vehicleModel.mjs";

export const createNewVehicle = async (vehicle) => {
  const policy = await Policy.findOne({
    policyId: vehicle.cancellationPolicyId,
  });
  const operator = await BusOperator.findOne({
    operatorId: vehicle.busOperatorId,
  });

  vehicle.cancellationPolicy = policy._id;
  vehicle.busOperator = operator._id;

  const newVehicle = new Vehicle(vehicle);
  const savedVehicle = await newVehicle.save();

  const populatedVechicle = await Vehicle.findById(savedVehicle._id)
    .select(
      "vehicleId registrationNumber createdAt updatedAt model capacity type status airCondition adjustableSeats chargingCapability restStops movie music cupHolder emergencyExit pricePerSeat bookingClose -_id"
    )
    .populate({
      path: "cancellationPolicy",
      select: "policyId policyName -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });

  return populatedVechicle;
};

export const getAllVehicles = async () => {
  const foundVehicles = await Vehicle.find()
    .select(
      "vehicleId registrationNumber createdAt updatedAt model capacity type status airCondition adjustableSeats chargingCapability restStops movie music cupHolder emergencyExit pricePerSeat bookingClose -_id"
    )
    .populate({
      path: "cancellationPolicy",
      select: "policyId policyName -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  return foundVehicles;
};

export const getVehicleByRegistrationNumber = async (registrationNumber) => {
  const foundVehicle = await Vehicle.findOne({
    registrationNumber: registrationNumber,
  })
    .select(
      "vehicleId registrationNumber createdAt updatedAt model capacity type status airCondition adjustableSeats chargingCapability restStops movie music cupHolder emergencyExit pricePerSeat bookingClose -_id"
    )
    .populate({
      path: "cancellationPolicy",
      select: "policyId policyName -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  return foundVehicle;
};

export const getVehicleById = async (id) => {
  const foundVehicle = await Vehicle.findOne({ vehicleId: id })
    .select(
      "vehicleId registrationNumber createdAt updatedAt model capacity type status airCondition adjustableSeats chargingCapability restStops movie music cupHolder emergencyExit pricePerSeat bookingClose -_id"
    )
    .populate({
      path: "cancellationPolicy",
      select: "policyId policyName -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  return foundVehicle;
};

export const updateVehicleById = async (id, newData) => {
  const policy = await Policy.findOne({
    policyId: newData.cancellationPolicyId,
  });
  const operator = await BusOperator.findOne({
    operatorId: newData.busOperatorId,
  });

  newData.cancellationPolicy = policy._id;
  newData.busOperator = operator._id;

  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { vehicleId: id },
    newData,
    { new: true, runValidators: true }
  );
  if (!updatedVehicle) return null;

  const returnVehicle = await Vehicle.findOne({ vehicleId: id })
    .select(
      "vehicleId registrationNumber createdAt updatedAt model capacity type status airCondition adjustableSeats chargingCapability restStops movie music cupHolder emergencyExit pricePerSeat bookingClose -_id"
    )
    .populate({
      path: "cancellationPolicy",
      select: "policyId policyName -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });

  return returnVehicle;
};

export const deleteVehicleById = async (id) => {
  const foundVehicle = await Vehicle.findOne({ vehicleId: id })
    .select(
      "vehicleId registrationNumber createdAt updatedAt model capacity type status airCondition adjustableSeats chargingCapability restStops movie music cupHolder emergencyExit pricePerSeat bookingClose -_id"
    )
    .populate({
      path: "cancellationPolicy",
      select: "policyId policyName -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  if (!foundVehicle) return null;

  await Vehicle.findOneAndDelete({ vehicleId: id });
  return foundVehicle;
};
