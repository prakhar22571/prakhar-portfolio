import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const PortfolioDataContext = createContext(null);

const EMPTY = {
  user: {},
  timeline: [],
  skills: [],
  apps: [],
  projects: [],
};

/**
 * Fetches every section's data in one parallel batch so the page can show a
 * single loader until all of it is ready (instead of each section popping in
 * separately after its own request). The backend can be slow to wake, so this
 * also gives us one place to handle the load failing.
 */
export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [user, timeline, skills, apps, projects] = await Promise.all([
        api.get("/api/v1/user/portfolio/me"),
        api.get("/api/v1/timeline/getall"),
        api.get("/api/v1/skill/getall"),
        api.get("/api/v1/softwareapplication/getall"),
        api.get("/api/v1/project/getall"),
      ]);
      setData({
        user: user.data.user || {},
        timeline: timeline.data.timelines || [],
        skills: skills.data.skills || [],
        apps: apps.data.softwareApplications || [],
        projects: projects.data.projects || [],
      });
      setStatus("ready");
    } catch (error) {
      console.error("Failed to load portfolio data:", error);
      setData(EMPTY);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PortfolioDataContext.Provider value={{ ...data, status, reload: load }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error("usePortfolioData must be used within a PortfolioDataProvider");
  }
  return ctx;
}
