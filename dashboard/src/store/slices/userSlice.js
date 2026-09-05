import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";
const request = (name, callback) =>
  createAsyncThunk(`user/${name}`, async (argument, { rejectWithValue }) => {
    try {
      return await callback(argument);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  });
export const acceptSession = (data) => {
  if (data.token) localStorage.setItem("token", data.token);
  return data.user;
};
const loginRequest = request("login", async ({ email, password }) =>
  acceptSession(
    (await api.post("/api/v1/user/login", { email, password })).data,
  ),
);
export const login = (email, password) => loginRequest({ email, password });
export const getUser = createAsyncThunk(
  "user/load",
  async (_, { rejectWithValue }) => {
    const originalToken = localStorage.getItem("token");
    try {
      return (await api.get("/api/v1/user/me")).data.user;
    } catch (error) {
      if (
        [401, 403].includes(error.response?.status) &&
        localStorage.getItem("token") === originalToken
      )
        localStorage.removeItem("token");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  { condition: (_, { getState }) => !getState().user.loading },
);
export const logout = request("logout", async () => {
  await api.get("/api/v1/user/logout");
  localStorage.removeItem("token");
});
export const updateProfile = request(
  "updateProfile",
  async (data) =>
    (await api.put("/api/v1/user/me/profile/update", data)).data.user,
);
const passwordRequest = request(
  "updatePassword",
  async (data) => (await api.put("/api/v1/user/password/update", data)).data,
);
export const updatePassword = (
  currentPassword,
  newPassword,
  confirmNewPassword,
) => passwordRequest({ currentPassword, newPassword, confirmNewPassword });
const slice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: {},
    isAuthenticated: false,
    authChecked: false,
    error: null,
    loadRequestId: null,
  },
  reducers: {
    sessionReceived(state, action) {
      state.loading = false;
      state.loadRequestId = null;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecked = true;
      state.error = null;
    },
  },
  extraReducers(builder) {
    for (const thunk of [
      loginRequest,
      getUser,
      logout,
      updateProfile,
      passwordRequest,
    ]) {
      builder.addCase(thunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (thunk === getUser) state.loadRequestId = action.meta.requestId;
        else if (thunk === loginRequest) state.loadRequestId = null;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        if (thunk === getUser && state.loadRequestId !== action.meta.requestId)
          return;
        state.loading = false;
        if (thunk === getUser || thunk === loginRequest) {
          state.authChecked = true;
          state.isAuthenticated = false;
          state.user = {};
        }
        state.error = action.payload;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        if (thunk === getUser && state.loadRequestId !== action.meta.requestId)
          return;
        state.loading = false;
        if (thunk === logout) {
          state.authChecked = true;
          state.user = {};
          state.isAuthenticated = false;
        } else if (thunk !== passwordRequest) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.authChecked = true;
        }
      });
    }
  },
});
export const { sessionReceived } = slice.actions;
export default slice.reducer;
