import { lazy, Suspense } from "react";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { Loader } from "@/components/loader";
import { PageTransition } from "@/components/page-transition";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Not lazy: it's the landing page every visitor hits first, and its own
// PortfolioDataProvider already shows a <Loader/> while data loads - lazy
// import here would mount a second, separate Loader for the Suspense
// fallback first, restarting the spin animation.
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
        <Router>
          <header className="glass sticky top-0 z-50 flex justify-end px-4 py-2 sm:px-6">
            <ModeToggle />
          </header>
          <Suspense fallback={<Loader />}>
            <AnimatedRoutes />
          </Suspense>
          <ToastContainer position="bottom-right" theme="dark" />
        </Router>
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;
