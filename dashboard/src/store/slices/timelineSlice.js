import { createResourceSlice } from "../createResourceSlice";
const resource = createResourceSlice({
  name: "timeline",
  stateKey: "timeline",
  endpoint: "timeline",
  singular: "newTimeline",
  plural: "timelines",
  newestFirst: true,
});
export const getAllTimeline = resource.fetchAll;
export const addNewTimeline = resource.add;
export const deleteTimeline = resource.remove;
export default resource.reducer;
