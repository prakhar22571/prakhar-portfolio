import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";
import api from "@/lib/api";
import { PortfolioDataContext } from "./portfolio-context";
const empty = { user: {}, timeline: [], skills: [], apps: [], projects: [] };
export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState("loading");
  const cache = useRef({ data: null, promise: null });
  const load = useCallback(async (force = false) => {
    if (cache.current.data && !force) return;
    setStatus("loading");
    if (!cache.current.promise) {
      cache.current.promise = Promise.all([
        api.get("/api/v1/user/portfolio/me"),
        api.get("/api/v1/timeline/getall"),
        api.get("/api/v1/skill/getall"),
        api.get("/api/v1/softwareapplication/getall"),
        api.get("/api/v1/project/getall"),
      ])
        .then(([user, timeline, skills, apps, projects]) => ({
          user: user.data.user || {},
          timeline: timeline.data.timelines || [],
          skills: skills.data.skills || [],
          apps: apps.data.softwareApplications || [],
          projects: projects.data.projects || [],
        }))
        .finally(() => {
          cache.current.promise = null;
        });
    }
    try {
      const next = await cache.current.promise;
      cache.current.data = next;
      setData(next);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);
  return (
    <PortfolioDataContext.Provider
      value={{ ...data, status, load, reload: () => load(true) }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

PortfolioDataProvider.propTypes = {
  children: PropTypes.node,
};
