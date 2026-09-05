import { test, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userReducer, {
  getUser,
  sessionReceived,
} from "@/store/slices/userSlice";
import ResetPassword from "@/pages/ResetPassword";
import App from "@/App";
import { store } from "@/store/store";
import api from "@/lib/api";
import HomePage from "@/pages/HomePage";
import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeProvider } from "@portfolio/shared/components/theme-provider";
vi.mock("@/lib/api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));
const user = {
  _id: "owner",
  fullName: "Owner",
  aboutMe: "About",
  portfolioURL: "https://example.com",
};
beforeEach(() => {
  vi.clearAllMocks();
  store.dispatch({ type: "user/logout/fulfilled" });
});
test("password reset stores the bearer token and authenticates immediately", async () => {
  api.put.mockResolvedValue({ data: { token: "reset-session", user } });
  const localStore = configureStore({ reducer: { user: userReducer } });
  render(
    <Provider store={localStore}>
      <MemoryRouter initialEntries={["/password/reset/token"]}>
        <Routes>
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/" element={<p>Authenticated home</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "new-password" },
  });
  fireEvent.change(screen.getByLabelText("Confirm password"), {
    target: { value: "new-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Reset password" }));
  await screen.findByText("Authenticated home");
  expect(localStorage.getItem("token")).toBe("reset-session");
  expect(localStore.getState().user.isAuthenticated).toBe(true);
});
test("a stale bootstrap failure cannot clear a newly reset session", async () => {
  let reject;
  api.get.mockImplementation(
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  const localStore = configureStore({ reducer: { user: userReducer } });
  const pending = localStore.dispatch(getUser());
  localStorage.setItem("token", "fresh");
  localStore.dispatch(sessionReceived(user));
  reject({ response: { status: 401 } });
  await pending;
  expect(localStore.getState().user.isAuthenticated).toBe(true);
  expect(localStorage.getItem("token")).toBe("fresh");
});
test("protected collections are loaded after login, not on the login screen", async () => {
  window.history.replaceState({}, "", "/login");
  api.get.mockImplementation(async (url) => {
    if (url.endsWith("/me"))
      throw { response: { status: 401, data: { message: "Please log in." } } };
    return {
      data: {
        skills: [],
        projects: [],
        timelines: [],
        softwareApplications: [],
        messages: [
          {
            _id: "message",
            senderName: "Visitor",
            subject: "Hello",
            message: "A saved message",
          },
        ],
      },
    };
  });
  api.post.mockResolvedValue({ data: { token: "login-session", user } });
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const button = await screen.findByRole("button", { name: "Login" });
  await waitFor(() => expect(button.disabled).toBe(false));
  expect(api.get.mock.calls.map(([url]) => url)).toEqual(["/api/v1/user/me"]);
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "owner@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "valid-password" },
  });
  fireEvent.click(button);
  await waitFor(() =>
    expect(api.get).toHaveBeenCalledWith("/api/v1/message/getall"),
  );
  await waitFor(() =>
    expect(store.getState().messages.messages).toHaveLength(1),
  );
});

test("mobile Timeline and Account use the same navigation state, and Messages can return home", async () => {
  store.dispatch(sessionReceived(user));
  render(
    <Provider store={store}>
      <MemoryRouter>
        <LazyMotion features={domAnimation}>
          <ThemeProvider>
            <HomePage />
          </ThemeProvider>
        </LazyMotion>
      </MemoryRouter>
    </Provider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Add Timeline",
    }),
  );
  await screen.findByRole("heading", { name: "Add timeline" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Account" }),
  );
  await screen.findByRole("heading", { name: "Settings" });
  expect(
    within(screen.getByRole("navigation", { name: "Dashboard sections" }))
      .getByRole("button", { name: "Account" })
      .getAttribute("aria-current"),
  ).toBe("page");
  fireEvent.click(
    within(
      screen.getByRole("navigation", { name: "Dashboard sections" }),
    ).getByRole("button", { name: "Messages" }),
  );
  await screen.findByText("No Messages Found!");
  fireEvent.click(screen.getByRole("button", { name: "Return to Dashboard" }));
  await screen.findByText("Projects Completed");
});
