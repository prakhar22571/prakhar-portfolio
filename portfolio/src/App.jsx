import { PortfolioDataProvider } from "@/context/portfolio-data";
import { lazy, Suspense } from "react";
import "./App.css";
import { ThemeProvider } from "@portfolio/shared/components/theme-provider";
import { ModeToggle } from "@portfolio/shared/components/mode-toggle";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { Loader } from "@/components/loader";
import { PageTransition } from "@portfolio/shared/components/page-transition";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";

const ProjectView = lazy(() => import("./pages/ProjectView"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PageTransition>
              <ProjectView />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LazyMotion features={domAnimation}>
        <PortfolioDataProvider>
          <Router>
            <header className="glass sticky top-0 z-50 flex justify-end px-4 py-2 sm:px-6">
              <ModeToggle />
            </header>
            <Suspense fallback={<Loader />}>
              <AnimatedRoutes />
            </Suspense>
            <ToastContainer position="bottom-right" theme="dark" />
          </Router>
        </PortfolioDataProvider>
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;
