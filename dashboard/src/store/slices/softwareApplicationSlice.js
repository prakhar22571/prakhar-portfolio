import { createResourceSlice } from "../createResourceSlice";
const resource = createResourceSlice({
  name: "softwareApplications",
  stateKey: "softwareApplications",
  endpoint: "softwareapplication",
  singular: "softwareApplication",
  plural: "softwareApplications",
});
export const getAllSoftwareApplications = resource.fetchAll;
export const addNewSoftwareApplication = resource.add;
export const deleteSoftwareApplication = resource.remove;
export default resource.reducer;
