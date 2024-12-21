import { BusOperator } from "../model/busOperatorModel.mjs";
import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.FINAL_AWS_REGION,
});

export const createNewBusOperator = async (operator) => {
  try {
    const congnitoUser = await createAWSCognitoUser(operator);
    if (!congnitoUser) return null;

    const newOperator = new BusOperator(operator);
    const savedOperator = await newOperator.save();
    console.log(`operator saved successfully :)`);

    const returnOperator = filterOperatorFields(savedOperator);
    return returnOperator;
  } catch (error) {
    console.log(`operator creation error ${error}`);
    return null;
  }
};

export const getAllOperators = async () => {
  try {
    const foundOperators = await BusOperator.find().select(
      "operatorId  federatedUserId name createdAt updatedAt company contact -_id"
    );
    console.log(`operator fetched successfully`);
    return foundOperators;
  } catch (error) {
    console.log(`operator getting error ${error}`);
  }
};

export const getOperatorById = async (id) => {
  try {
    const foundOperator = await BusOperator.findOne({ operatorId: id }).select(
      "operatorId  federatedUserId name createdAt updatedAt company contact -_id"
    );
    console.log(`operator fetched successfully`);
    return foundOperator;
  } catch (error) {
    console.log(`operator getting error ${error}`);
  }
};

export const updateOperatorById = async (id, newData, foundOperator) => {
  try {
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
  } catch (error) {
    console.log(`operator updating error ${error}`);
  }
};

export const deleteOperatorById = async (id, foundOperator) => {
  try {
    const response = await deleteAWSCognitoUser(foundOperator);
    if (!response) {
      console.error(`Failed to delete Cognito user for operator ID: ${id}`);
      return null;
    }

    await BusOperator.findOneAndDelete({ operatorId: id });
    return filterOperatorFields(foundOperator);
  } catch (error) {
    console.log(`operator deleting error ${error}`);
  }
};

const updateCognitoUserAttribute = async (username, attributes) => {
  try {
    const params = {
      UserPoolId: process.env.COGNITOR_USER_POOL_ID_BusOperatorPool,
      Username: username,
      UserAttributes: attributes,
    };

    const response = await cognito.adminUpdateUserAttributes(params).promise();
    console.log(`User attributes updated successfully`, response);
    return response;
  } catch (error) {
    console.error(`Error updating user attributes: ${error.message}`);
    return null;
  }
};

const deleteAWSCognitoUser = async (operator) => {
  try {
    const params = {
      UserPoolId: process.env.COGNITOR_USER_POOL_ID_BusOperatorPool,
      Username: operator.federatedUserId,
    };

    const response = await cognito.adminDeleteUser(params).promise();
    console.log(
      `cognito user ${operator.federatedUserId} deleted successfully`
    );
    return response;
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    return null;
  }
};

const createAWSCognitoUser = async (operator) => {
  try {
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
  } catch (error) {
    console.log("Error creating user or adding to group:", error);
    return null;
  }
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
