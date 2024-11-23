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

const filterPolicyFields = (policy) => ({
  policyId: policy.policyId,
  createdAt: policy.createdAt,
  updatedAt: policy.updatedAt,
  policyName: policy.policyName,
  type: policy.type,
  description: policy.description,
});
