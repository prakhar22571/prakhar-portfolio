import { createResourceSlice } from "../createResourceSlice";
const resource = createResourceSlice({
  name: "project",
  stateKey: "projects",
  endpoint: "project",
  singular: "project",
  plural: "projects",
});
export const getAllProjects = resource.fetchAll;
export const addNewProject = resource.add;
export const updateProject = (id, data) => resource.update({ id, data });
export const deleteProject = resource.remove;
export default resource.reducer;
