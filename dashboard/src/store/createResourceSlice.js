import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export function createResourceSlice(
  { name, stateKey, endpoint, singular, plural, newestFirst = false },
  client = api,
) {
  const request = (type, callback) =>
    createAsyncThunk(
      `${name}/${type}`,
      async (argument, { rejectWithValue }) => {
        try {
          return await callback(argument);
        } catch (error) {
          return rejectWithValue(
            error.response?.data?.message || error.message,
          );
        }
      },
    );
  const fetchAll = createAsyncThunk(
    `${name}/fetch`,
    async (_, { rejectWithValue }) => {
      try {
        return (await client.get(`/api/v1/${endpoint}/getall`)).data[plural];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    },
    { condition: (_, { getState }) => !getState()[name]?.fetching },
  );
  const add = request(
    "add",
    async (data) =>
      (await client.post(`/api/v1/${endpoint}/add`, data)).data[singular],
  );
  const update = request(
    "update",
    async ({ id, data }) =>
      (await client.put(`/api/v1/${endpoint}/update/${id}`, data)).data[
        singular
      ],
  );
  const remove = request("delete", async (id) => {
    await client.delete(`/api/v1/${endpoint}/delete/${id}`);
    return id;
  });
  function applyChange(state, { id, record }) {
    const index = state[stateKey].findIndex((item) => item._id === id);
    if (!record) {
      if (index >= 0) state[stateKey].splice(index, 1);
    } else if (index >= 0) state[stateKey][index] = record;
    else if (newestFirst) state[stateKey].unshift(record);
    else state[stateKey].push(record);
  }
  const slice = createSlice({
    name,
    initialState: {
      [stateKey]: [],
      loading: false,
      fetching: false,
      pending: {},
      error: null,
      fetchId: null,
      fetchChanges: [],
    },
    reducers: {},
    extraReducers(builder) {
      builder.addCase(fetchAll.pending, (state, action) => {
        state.fetching = true;
        state.error = null;
        state.fetchId = action.meta.requestId;
        state.fetchChanges = [];
      });
      builder.addCase(fetchAll.fulfilled, (state, action) => {
        if (state.fetchId !== action.meta.requestId) return;
        state.fetching = false;
        state[stateKey] = action.payload;
        // Replay mutations completed during this request over its older snapshot.
        for (const change of state.fetchChanges) applyChange(state, change);
        state.fetchChanges = [];
      });
      builder.addCase(fetchAll.rejected, (state, action) => {
        if (state.fetchId !== action.meta.requestId) return;
        state.fetching = false;
        state.fetchChanges = [];
        state.error = action.payload;
      });
      for (const thunk of [add, update, remove]) {
        builder.addCase(thunk.pending, (state, action) => {
          state.pending[action.meta.requestId] = true;
          state.loading = true;
        });
        builder.addCase(thunk.rejected, (state, action) => {
          delete state.pending[action.meta.requestId];
          state.loading = Object.keys(state.pending).length > 0;
        });
        builder.addCase(thunk.fulfilled, (state, action) => {
          if (!state.pending[action.meta.requestId]) return;
          delete state.pending[action.meta.requestId];
          state.loading = Object.keys(state.pending).length > 0;
          const change =
            thunk === remove
              ? { id: action.payload }
              : { id: action.payload._id, record: action.payload };
          applyChange(state, change);
          if (state.fetching) state.fetchChanges.push(change);
        });
      }
    },
  });
  return { reducer: slice.reducer, fetchAll, add, update, remove };
}
