import { describe, test, expect, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { createResourceSlice } from "@/store/createResourceSlice";
const defer = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
function fixture(client) {
  const resource = createResourceSlice(
    {
      name: "project",
      stateKey: "projects",
      endpoint: "project",
      singular: "project",
      plural: "projects",
    },
    client,
  );
  return {
    resource,
    store: configureStore({ reducer: { project: resource.reducer } }),
  };
}
describe("resource state", () => {
  test("mutations update local collections without extra GETs", async () => {
    const client = {
      get: vi
        .fn()
        .mockResolvedValue({ data: { projects: [{ _id: "a", title: "A" }] } }),
      post: vi
        .fn()
        .mockResolvedValue({ data: { project: { _id: "b", title: "B" } } }),
      put: vi.fn().mockResolvedValue({
        data: { project: { _id: "a", title: "Updated" } },
      }),
      delete: vi.fn().mockResolvedValue({}),
    };
    const { resource: r, store } = fixture(client);
    await store.dispatch(r.fetchAll());
    await store.dispatch(r.add({}));
    await store.dispatch(r.update({ id: "a", data: {} }));
    await store.dispatch(r.remove("b"));
    expect(store.getState().project.projects).toEqual([
      { _id: "a", title: "Updated" },
    ]);
    expect(client.get).toHaveBeenCalledTimes(1);
  });
  test("slow list responses retain existing records and replay later mutations", async () => {
    const fetch = defer();
    const client = {
      get: vi.fn(() => fetch.promise),
      post: vi.fn().mockResolvedValue({ data: { project: { _id: "new" } } }),
    };
    const { resource: r, store } = fixture(client);
    const pending = store.dispatch(r.fetchAll());
    await store.dispatch(r.add({}));
    fetch.resolve({ data: { projects: [{ _id: "existing" }] } });
    await pending;
    expect(store.getState().project.projects.map((p) => p._id)).toEqual([
      "existing",
      "new",
    ]);
  });
  test("failed refresh retains the last successful list", async () => {
    const client = {
      get: vi
        .fn()
        .mockResolvedValueOnce({ data: { projects: [{ _id: "a" }] } })
        .mockRejectedValueOnce(new Error("offline")),
    };
    const { resource: r, store } = fixture(client);
    await store.dispatch(r.fetchAll());
    await store.dispatch(r.fetchAll());
    expect(store.getState().project.projects).toEqual([{ _id: "a" }]);
    expect(store.getState().project.error).toBe("offline");
  });
  test("pending results cannot repopulate state cleared on logout", () => {
    const { resource: r } = fixture({});
    const state = r.reducer(
      undefined,
      r.fetchAll.fulfilled([{ _id: "private" }], "old-request"),
    );
    expect(state.projects).toEqual([]);
  });
});
