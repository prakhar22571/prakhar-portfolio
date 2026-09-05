import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./slices/userSlice";
import skill from "./slices/skillSlice";
import project from "./slices/projectSlice";
import timeline from "./slices/timelineSlice";
import softwareApplications from "./slices/softwareApplicationSlice";
import messages from "./slices/messageSlice";
const combined = combineReducers({
  user,
  skill,
  project,
  timeline,
  softwareApplications,
  messages,
});
export const store = configureStore({
  reducer: (state, action) => {
    if (action.type === "user/logout/fulfilled") state = undefined;
    return combined(state, action);
  },
});
