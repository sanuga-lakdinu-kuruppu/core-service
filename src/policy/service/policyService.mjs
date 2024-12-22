import { Policy } from "../model/policyModel.mjs";

export const createNewPolicy = async (policy) => {
  const newPolicy = new Policy(policy);
  const savedPolicy = await newPolicy.save();
  return filterPolicyFields(savedPolicy);
};

export const getAllPolicies = async (filter = {}) => {
  const foundPolicies = await Policy.find(filter).select(
    "policyId policyName createdAt updatedAt type description -_id"
  );
  return foundPolicies;
};

export const getPolicyById = async (id) => {
  const foundPolicy = await Policy.findOne({ policyId: id }).select(
    "policyId policyName createdAt updatedAt type description -_id"
  );
  return foundPolicy;
};

export const updatePolicyById = async (id, newData) => {
  const updatedPolicy = await Policy.findOneAndUpdate(
    { policyId: id },
    newData,
    { new: true, runValidators: true }
  );
  if (!updatedPolicy) return null;
  return filterPolicyFields(updatedPolicy);
};

export const deletePolicyById = async (id) => {
  const deletedPolicy = await Policy.findOneAndDelete({ policyId: id });
  if (!deletedPolicy) return null;
  return filterPolicyFields(deletedPolicy);
};

const filterPolicyFields = (policy) => ({
  policyId: policy.policyId,
  createdAt: policy.createdAt,
  updatedAt: policy.updatedAt,
  policyName: policy.policyName,
  type: policy.type,
  description: policy.description,
});
