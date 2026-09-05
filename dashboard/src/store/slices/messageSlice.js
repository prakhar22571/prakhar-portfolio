import { createResourceSlice } from "../createResourceSlice";
const resource = createResourceSlice({
  name: "messages",
  stateKey: "messages",
  endpoint: "message",
  singular: "data",
  plural: "messages",
});
export const getAllMessages = resource.fetchAll;
export const deleteMessage = resource.remove;
export default resource.reducer;
