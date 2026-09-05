import { createResourceSlice } from "../createResourceSlice";
const resource = createResourceSlice({
  name: "skill",
  stateKey: "skills",
  endpoint: "skill",
  singular: "skill",
  plural: "skills",
});
export const getAllSkills = resource.fetchAll;
export const addNewSkill = resource.add;
export const updateSkill = (id, proficiency) =>
  resource.update({ id, data: { proficiency } });
export const deleteSkill = resource.remove;
export default resource.reducer;
