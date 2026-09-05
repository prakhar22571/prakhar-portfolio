import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/userSlice";
import { getAllSkills } from "./store/slices/skillSlice";
import { getAllSoftwareApplications } from "./store/slices/softwareApplicationSlice";
import { getAllTimeline } from "./store/slices/timelineSlice";
import { getAllMessages } from "./store/slices/messageSlice";
import { getAllProjects } from "./store/slices/projectSlice";
import { ThemeProvider } from "@portfolio/shared/components/theme-provider";
import { PageTransition } from "@portfolio/shared/components/page-transition";
import { Status } from "@portfolio/shared/components/status";
import { ProtectedRoute } from "@/components/protected-route";
import { DataStatus } from "@/components/data-status";
const Login = lazy(() => import("./pages/Login"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ManageSkills = lazy(() => import("./pages/ManageSkills"));
const ManageProjects = lazy(() => import("./pages/ManageProjects"));
const UpdateProject = lazy(() => import("./pages/UpdateProject"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ManageTimeline = lazy(() => import("./pages/ManageTimeline"));
const ViewProject = lazy(() => import("./pages/ViewProject"));
const routes = [
  ["/", HomePage, true],
  ["/login", Login],
  ["/password/forgot", ForgotPassword],
  ["/password/reset/:token", ResetPassword],
  ["/manage/skills", ManageSkills, true],
  ["/manage/timeline", ManageTimeline, true],
  ["/manage/projects", ManageProjects, true],
  ["/view/project/:id", ViewProject, true],
  ["/update/project/:id", UpdateProject, true],
];
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map(([path, Page, protectedPage]) => (
          <Route
            key={path}
            path={path}
            element={
              <PageTransition>
                {protectedPage ? (
                  <ProtectedRoute>
                    <Page />
                  </ProtectedRoute>
                ) : (
                  <Page />
                )}
              </PageTransition>
            }
          />
        ))}
        <Route path="*" element={<Status error="Page not found." />} />
      </Routes>
    </AnimatePresence>
  );
}
export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated) return;
    for (const fetch of [
      getAllSkills,
      getAllSoftwareApplications,
      getAllTimeline,
      getAllMessages,
      getAllProjects,
    ])
      dispatch(fetch());
  }, [dispatch, isAuthenticated]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LazyMotion features={domAnimation}>
        <Router>
          <div
            aria-hidden="true"
            className="bg-aurora motion-safe:animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
          />
          <DataStatus />
          <Suspense fallback={<Status loading />}>
            <AnimatedRoutes />
          </Suspense>
          <ToastContainer position="bottom-right" theme="colored" />
        </Router>
      </LazyMotion>
    </ThemeProvider>
  );
}
