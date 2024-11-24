import { Policy } from "../../policy/model/policyModel.mjs";
import { BusOperator } from "../../busOperator/model/busOperatorModel.mjs";
import { Vehicle } from "../model/vehicleModel.mjs";

export const createNewVehicle = async (vehicle) => {
  try {
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
    console.log(`vehicle saved successfully :)`);

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
  } catch (error) {
    console.log(`vehicle creation error ${error}`);
  }
};

export const getAllVehicles = async () => {
  try {
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
    console.log(`vehicle fetched successfully`);
    return foundVehicles;
  } catch (error) {
    console.log(`vehicle getting error ${error}`);
  }
};

export const getVehicleByRegistrationNumber = async (registrationNumber) => {
  try {
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
    console.log(`vehicle fetched successfully`);
    return foundVehicle;
  } catch (error) {
    console.log(`vehicle getting error ${error}`);
  }
};

export const getVehicleById = async (id) => {
  try {
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
    console.log(`vehicle fetched successfully`);
    return foundVehicle;
  } catch (error) {
    console.log(`vehicle getting error ${error}`);
  }
};

export const updateVehicleById = async (id, newData) => {
  try {
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
  } catch (error) {
    console.log(`vehicle getting error ${error}`);
  }
};

export const deleteVehicleById = async (id) => {
  try {
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
  } catch (error) {
    console.log(`vehicle deleting error ${error}`);
  }
};
