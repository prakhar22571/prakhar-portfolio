import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice";
import { getAllSkills } from "./store/slices/skillSlice";
import { getAllSoftwareApplications } from "./store/slices/softwareApplicationSlice";
import { getAllTimeline } from "./store/slices/timelineSlice";
import { getAllMessages } from "./store/slices/messageSlice";
import { getAllProjects } from "./store/slices/projectSlice";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/page-transition";

const Login = lazy(() => import("./pages/Login"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ManageSkills = lazy(() => import("./pages/ManageSkills"));
const ManageProjects = lazy(() => import("./pages/ManageProjects"));
const UpdateProject = lazy(() => import("./pages/UpdateProject"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ManageTimeline = lazy(() => import("./pages/ManageTimeline"));
const ViewProject = lazy(() => import("./pages/ViewProject"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/password/forgot" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/password/reset/:token" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/manage/skills" element={<PageTransition><ManageSkills /></PageTransition>} />
        <Route path="/manage/timeline" element={<PageTransition><ManageTimeline /></PageTransition>} />
        <Route path="/manage/projects" element={<PageTransition><ManageProjects /></PageTransition>} />
        <Route path="/view/project/:id" element={<PageTransition><ViewProject /></PageTransition>} />
        <Route path="/update/project/:id" element={<PageTransition><UpdateProject /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllSkills());
    dispatch(getAllSoftwareApplications());
    dispatch(getAllTimeline());
    dispatch(getAllMessages());
    dispatch(getAllProjects());
  }, []);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LazyMotion features={domAnimation}>
        <Router>
          <Suspense fallback={null}>
            <AnimatedRoutes />
          </Suspense>
          <ToastContainer position="bottom-right" theme="dark" />
        </Router>
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;
