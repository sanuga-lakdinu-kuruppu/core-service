import { BusOperator } from "../model/busOperatorModel.mjs";
import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.FINAL_AWS_REGION,
});

export const createNewBusOperator = async (operator) => {
  const congnitoUser = await createAWSCognitoUser(operator);
  if (!congnitoUser) return null;

  const newOperator = new BusOperator(operator);
  const savedOperator = await newOperator.save();

  return filterOperatorFields(savedOperator);
};

export const getAllOperators = async () => {
  const foundOperators = await BusOperator.find().select(
    "operatorId  federatedUserId name createdAt updatedAt company contact -_id"
  );
  return foundOperators;
};

export const getOperatorById = async (id) => {
  const foundOperator = await BusOperator.findOne({ operatorId: id }).select(
    "operatorId  federatedUserId name createdAt updatedAt company contact -_id"
  );
  return foundOperator;
};

export const updateOperatorById = async (id, newData, foundOperator) => {
  if (foundOperator.contact.email !== newData.contact.email) {
    const attributesToUpdate = [
      { Name: "email", Value: newData.contact.email },
    ];
    const response = await updateCognitoUserAttribute(
      foundOperator.federatedUserId,
      attributesToUpdate
    );

    if (!response) return null;
  }

  const updatedOperator = await BusOperator.findOneAndUpdate(
    { operatorId: id },
    newData,
    { new: true, runValidators: true }
  );
  if (!updatedOperator) return null;
  return filterOperatorFields(updatedOperator);
};

export const deleteOperatorById = async (id, foundOperator) => {
  const response = await deleteAWSCognitoUser(foundOperator);
  if (!response) {
    console.error(`Failed to delete Cognito user for operator ID: ${id}`);
    return null;
  }

  await BusOperator.findOneAndDelete({ operatorId: id });
  return filterOperatorFields(foundOperator);
};

const updateCognitoUserAttribute = async (username, attributes) => {
  const params = {
    UserPoolId: process.env.COGNITOR_USER_POOL_ID_BusOperatorPool,
    Username: username,
    UserAttributes: attributes,
  };

  const response = await cognito.adminUpdateUserAttributes(params).promise();
  return response;
};

const deleteAWSCognitoUser = async (operator) => {
  const params = {
    UserPoolId: process.env.COGNITOR_USER_POOL_ID_BusOperatorPool,
    Username: operator.federatedUserId,
  };

  const response = await cognito.adminDeleteUser(params).promise();
  return response;
};

const createAWSCognitoUser = async (operator) => {
  const username = operator.contact.email.split("@")[0];
  const params = {
    UserPoolId: process.env.COGNITOR_USER_POOL_ID_BusOperatorPool,
    Username: username,
    UserAttributes: [{ Name: "email", Value: operator.contact.email }],
    DesiredDeliveryMediums: ["EMAIL"],
  };

  const createUserResponse = await cognito.adminCreateUser(params).promise();

  const groupParams = {
    UserPoolId: process.env.COGNITOR_USER_POOL_ID_BusOperatorPool,
    Username: username,
    GroupName: process.env.COGNITOR_GROUP_ID_BusOperator,
  };

  await cognito.adminAddUserToGroup(groupParams).promise();
  return createUserResponse;
};

const filterOperatorFields = (operator) => ({
  operatorId: operator.operatorId,
  federatedUserId: operator.federatedUserId,
  createdAt: operator.createdAt,
  updatedAt: operator.updatedAt,
  name: operator.name,
  company: operator.company,
  contact: operator.contact,
});
