import { Policy } from "../model/policyModel.mjs";

export const createNewPolicy = async (policy) => {
  try {
    const newPolicy = new Policy(policy);
    const savedPolicy = await newPolicy.save();
    console.log(`policy saved successfully :)`);
    const returnPolicy = filterPolicyFields(savedPolicy);
    return returnPolicy;
  } catch (error) {
    console.log(`policy creation error ${error}`);
  }
};

export const getAllPolicies = async (filter = {}) => {
  try {
    const foundPolicies = await Policy.find(filter).select(
      "policyId policyName createdAt updatedAt type description -_id"
    );
    console.log(`policies fetched successfully`);
    return foundPolicies;
  } catch (error) {
    console.log(`policies getting error ${error}`);
  }
};

export const getPolicyById = async (id) => {
  try {
    const foundPolicy = await Policy.findOne({ policyId: id }).select(
      "policyId policyName createdAt updatedAt type description -_id"
    );
    console.log(`policy fetched successfully`);
    return foundPolicy;
  } catch (error) {
    console.log(`policy getting error ${error}`);
  }
};

export const updatePolicyById = async (id, newData) => {
  try {
    const updatedPolicy = await Policy.findOneAndUpdate(
      { policyId: id },
      newData,
      { new: true, runValidators: true }
    );
    if (!updatedPolicy) return null;
    return filterPolicyFields(updatedPolicy);
  } catch (error) {
    console.log(`policy updating error ${error}`);
  }
};

export const deletePolicyById = async (id) => {
  try {
    const deletedPolicy = await Policy.findOneAndDelete({ policyId: id });
    if (!deletedPolicy) return null;
    return filterPolicyFields(deletedPolicy);
  } catch (error) {
    console.log(`policy deleting error ${error}`);
  }
};

const filterPolicyFields = (policy) => ({
  policyId: policy.policyId,
  createdAt: policy.createdAt,
  updatedAt: policy.updatedAt,
  policyName: policy.policyName,
  type: policy.type,
  description: policy.description,
});
