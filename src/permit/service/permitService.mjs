import { Permit } from "../model/permitModel.mjs";
import { Vehicle } from "../../vehicle/model/vehicleModel.mjs";
import { Route } from "../../route/model/routeModel.mjs";
import { BusOperator } from "../../busOperator/model/busOperatorModel.mjs";

export const createNewPermit = async (permit) => {
  const currentRoute = await Route.findOne({
    routeId: permit.route,
  });
  const currentVehicle = await Vehicle.findOne({ vehicleId: permit.vehicle });
  const currentBusOperator = await BusOperator.findOne({
    operatorId: permit.busOperator,
  });

  permit.route = currentRoute._id;
  permit.vehicle = currentVehicle._id;
  permit.busOperator = currentBusOperator._id;

  const newPermit = new Permit(permit);
  const savedPermit = await newPermit.save();

  const populatedPermit = await Permit.findById(savedPermit._id)
    .select(
      "permitId permitNumber createdAt updatedAt issueDate expiryDate route vehicle busOperator -_id"
    )
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "vehicle",
      select: "vehicleId registrationNumber model -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });

  return populatedPermit;
};

export const getAllPermits = async () => {
  const foundPermits = await Permit.find()
    .select(
      "permitId permitNumber createdAt updatedAt issueDate expiryDate route vehicle busOperator -_id"
    )
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "vehicle",
      select: "vehicleId registrationNumber model -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  return foundPermits;
};

export const getPermitById = async (id) => {
  const foundPermit = await Permit.findOne({ permitId: id })
    .select(
      "permitId permitNumber createdAt updatedAt issueDate expiryDate route vehicle busOperator -_id"
    )
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "vehicle",
      select: "vehicleId registrationNumber model -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  return foundPermit;
};

export const getPermitByNumber = async (permitNumber) => {
  const foundPermit = await Permit.findOne({ permitNumber: permitNumber })
    .select(
      "permitId permitNumber createdAt updatedAt issueDate expiryDate route vehicle busOperator -_id"
    )
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "vehicle",
      select: "vehicleId registrationNumber model -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  return foundPermit;
};

export const deletePermitById = async (id) => {
  const foundPermit = await Permit.findOne({ permitId: id })
    .select(
      "permitId permitNumber createdAt updatedAt issueDate expiryDate route vehicle busOperator -_id"
    )
    .populate({
      path: "route",
      select: "routeId routeNumber -_id",
    })
    .populate({
      path: "vehicle",
      select: "vehicleId registrationNumber model -_id",
    })
    .populate({
      path: "busOperator",
      select: "operatorId company -_id",
    });
  if (!foundPermit) return null;

  await Permit.findOneAndDelete({ permitId: id });
  return foundPermit;
};
